import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiCopy,
  FiShare2,
  FiSave,
  FiX,
} from "react-icons/fi";

/**
 * BlogPost.jsx
 * - Inline editing (text + caption), delete blocks
 * - Save Draft (local) before Publish (Firestore)
 * - Cancel/Undo back to last persisted state
 * - Social buttons under title
 *
 * Notes:
 * - This file intentionally keeps hooks declarations stable.
 * - Only the post.owner (user.uid === post.userId) sees Edit controls.
 */

const FALLBACK_BG = "bg-gray-100";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hooks (stable order)
  const [post, setPost] = useState(null); // persisted post from Firestore
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit/draft state
  const [isEditing, setIsEditing] = useState(false); // whether we are editing now
  const [draftBlocks, setDraftBlocks] = useState(null); // local edits
  const [draftSaved, setDraftSaved] = useState(false); // whether Save Draft was clicked
  const [publishing, setPublishing] = useState(false); // when pushing to Firestore
  const [savingError, setSavingError] = useState("");

  // misc UI
  const [tocOpen, setTocOpen] = useState(false);
  const articleRef = useRef(null);
  const progressRef = useRef(null);

  // Load post once (stable hook)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "posts", id));
        if (!snap.exists()) {
          if (!mounted) return;
          setError("Post not found.");
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        if (!mounted) return;
        setPost(data);
        // ensure editing state cleared
        setIsEditing(false);
        setDraftBlocks(null);
        setDraftSaved(false);

        // SEO: title + description
        document.title = `${data.title} — ExplorePH`;
        const desc = (data.blocks || [])
          .filter((b) => b.type === "text")
          .map((b) => b.value)
          .join(" ")
          .slice(0, 160);
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }
        meta.content = desc || "ExplorePH travel story";
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load blog.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el || !progressRef.current) return;
      const start = el.offsetTop;
      const end = el.offsetTop + el.offsetHeight - window.innerHeight;
      if (end <= start) {
        progressRef.current.style.width = "100%";
        return;
      }
      const pct = Math.min(
        Math.max((window.scrollY - start) / (end - start), 0),
        1
      );
      progressRef.current.style.width = `${Math.round(pct * 100)}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [post]);

  // derived values
  const readingTime = useMemo(() => {
    const text = (post?.blocks || [])
      .filter((b) => b.type === "text")
      .map((b) => b.value)
      .join(" ");
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  const toc = useMemo(() => {
    if (!post?.blocks) return [];
    return post.blocks
      .map((b, i) =>
        b.type === "text"
          ? { id: `section-${i}`, title: summarizeForTOC(b.value || "") }
          : null
      )
      .filter(Boolean);
  }, [post]);

  // helpers for TOC
  function summarizeForTOC(text) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "Section";
    const first = clean.split(".")[0];
    const words = first.split(/\s+/).slice(0, 7).join(" ");
    return words.length < first.length ? words + "…" : words;
  }

  // share/copy helpers
  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(
      () => alert("Link copied to clipboard!"),
      () => alert("Could not copy link.")
    );
  }

  function shareNative() {
    if (!post) return;
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: (post.blocks || [])
            .find((b) => b.type === "text")
            ?.value?.slice(0, 120),
          url: window.location.href,
        })
        .catch(() => copyLink());
    } else {
      copyLink();
    }
  }

  async function handleDeletePost() {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    await deleteDoc(doc(db, "posts", id));
    alert("Blog deleted!");
    navigate("/blog");
  }

  // ------------- EDITING LOGIC ----------------
  // Enter editing mode: create a deep copy of blocks into draftBlocks
  function startEditing() {
    if (!post) return;
    // deep clone blocks array so editing won't mutate the persisted post
    const cloned = (post.blocks || []).map((b) => ({ ...b }));
    setDraftBlocks(cloned);
    setIsEditing(true);
    setDraftSaved(false);
    setSavingError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // update draft text block
  function updateDraftText(index, value) {
    setDraftBlocks((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], value };
      return copy;
    });
  }

  // update draft image caption
  function updateDraftCaption(index, caption) {
    setDraftBlocks((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], caption };
      return copy;
    });
  }

  // delete block from draft
  function deleteDraftBlock(index) {
    setDraftBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  // Save Draft locally (does not write to Firestore)
  function saveDraftLocally() {
    if (!draftBlocks) return;
    // simple validation: ensure draftBlocks is an array
    setDraftSaved(true);
    // notify user
    alert("Draft saved locally. Click 'Publish Changes' to update the post.");
  }

  // Cancel / Undo: restore from persisted post; clear draft
  function cancelEditing() {
    setIsEditing(false);
    setDraftBlocks(null);
    setDraftSaved(false);
    setSavingError("");
  }

  // Publish draft to Firestore (overwrite blocks)
  async function publishChangesToFirestore() {
    if (!draftBlocks || !post) {
      alert("No draft to publish.");
      return;
    }
    if (
      !window.confirm(
        "Publish changes to the live post? This will overwrite the post content."
      )
    )
      return;

    setPublishing(true);
    setSavingError("");
    try {
      const postRef = doc(db, "posts", post.id);
      // ensure blocks are in the right format (strip any temporary fields)
      const cleaned = draftBlocks.map((b) => {
        if (b.type === "text") return { type: "text", value: b.value || "" };
        if (b.type === "image")
          return { type: "image", url: b.url || "", caption: b.caption || "" };
        return b;
      });
      await updateDoc(postRef, { blocks: cleaned });
      // refresh local persisted post to reflect saved changes
      setPost((prev) => ({ ...prev, blocks: cleaned }));
      setIsEditing(false);
      setDraftBlocks(null);
      setDraftSaved(false);
      alert("Post updated!");
    } catch (err) {
      console.error("Publish error:", err);
      setSavingError(err.message || "Failed to publish changes.");
      alert("Publish failed: " + (err.message || "Unknown error"));
    } finally {
      setPublishing(false);
    }
  }

  // ------------- Image component --------------
  function BlogImage({ src, alt, caption, hero = false }) {
    const [loaded, setLoaded] = useState(false);
    const [err, setErr] = useState(false);

    return (
      <figure className="w-full">
        {!loaded && !err && (
          <div
            aria-hidden
            className={`rounded-2xl overflow-hidden ${FALLBACK_BG} ${
              hero ? "h-[48vh] md:h-[60vh]" : "h-60 md:h-80"
            } animate-pulse`}
          />
        )}

        {err ? (
          <div className="rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-gray-500">Image failed to load.</p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt || caption || "Blog image"}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErr(true)}
            className={`w-full object-cover rounded-2xl shadow-lg transition-all duration-500 ${
              hero ? "h-[48vh] md:h-[60vh]" : ""
            } ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            style={{ willChange: "opacity, transform" }}
          />
        )}

        {caption && !err && (
          <figcaption className="text-sm md:text-base text-gray-600 italic mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // ---------- UI states: loading / error ----------
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse space-y-4">
        <div className="h-72 bg-gray-300 rounded" />
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold py-16">
        {error}
      </p>
    );
  }

  // computed hero block
  const firstBlock = post.blocks && post.blocks.length ? post.blocks[0] : null;
  const firstIsImage = firstBlock?.type === "image" && firstBlock.url;

  // Which blocks to show in the article body?
  const displayBlocks = isEditing ? draftBlocks : post.blocks;

  return (
    <article
      ref={articleRef}
      className="max-w-6xl mx-auto px-4 lg:px-8 pt-28 pb-20"
    >
      {/* Progress bar */}
      <div
        className="h-1 w-full bg-white/40 rounded-full mb-6 overflow-hidden"
        aria-hidden
      >
        <div
          ref={progressRef}
          className="h-full bg-sky-600 rounded-full"
          style={{ width: "0%" }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN */}
        <main className="flex-1">
          {/* Back */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate("/blog")}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-3"
                aria-label="Back to blogs"
              >
                <FiArrowLeft /> Back to Blogs
              </button>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-sky-700">
                {post.title}
              </h1>

              {/* small meta + share row under title */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
                {post.province && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() =>
                        navigate(
                          `/blog?province=${encodeURIComponent(post.province)}`
                        )
                      }
                      className="text-sky-700 hover:underline font-semibold"
                    >
                      {post.province}
                    </button>
                  </>
                )}
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  aria-label="Share on Facebook"
                  className="px-3 py-2 bg-white/90 rounded-full shadow-sm hover:scale-105 transition"
                >
                  <svg
                    className="w-4 h-4 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2.4v-2.9h2.4V9.1c0-2.3 1.4-3.6 3.4-3.6.99 0 2.03.18 2.03.18v2.2h-1.12c-1.1 0-1.45.69-1.45 1.4v1.68h2.48l-.4 2.9h-2.08v7A10 10 0 0022 12z" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=${encodeURIComponent(post.title)}`,
                      "_blank"
                    )
                  }
                  aria-label="Share on X"
                  className="px-3 py-2 bg-white/90 rounded-full shadow-sm hover:scale-105 transition"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M22 5.8c-.6.3-1.3.6-2 .7.7-.4 1.3-1.1 1.6-1.9-.7.4-1.4.7-2.2.9C18.6 4.7 17.8 4 16.9 4c-1.6 0-2.9 1.3-2.9 2.9 0 .2 0 .4.1.6C10.4 7.4 7.3 5.6 5 3.1c-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.4 1.7 3-.6 0-1.2-.2-1.7-.5v.1c0 1.7 1.2 3.2 2.8 3.6-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.2C9 16.1 7.4 16.7 5.8 16.7c-.2 0-.4 0-.6 0 1.6 1 3.6 1.6 5.7 1.6 6.8 0 10.5-5.6 10.5-10.5v-.5c.8-.6 1.5-1.4 2-2.3-.8.4-1.6.6-2.5.7z" />
                  </svg>
                </button>

                <button
                  onClick={copyLink}
                  className="px-3 py-2 bg-white/90 rounded-full shadow-sm hover:scale-105 transition flex items-center gap-2"
                  aria-label="Copy link"
                >
                  <FiCopy /> <span className="sr-only">Copy link</span>
                </button>

                <button
                  onClick={shareNative}
                  className="px-3 py-2 bg-white/90 rounded-full shadow-sm hover:scale-105 transition flex items-center gap-2"
                  aria-label="Open native share"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* Edit controls (owner only) */}
            {user?.uid === post.userId && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={startEditing}
                    className="px-3 py-2 bg-sky-700 text-white rounded flex items-center gap-2"
                  >
                    <FiEdit /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveDraftLocally}
                      disabled={!draftBlocks}
                      className="px-3 py-2 bg-amber-400 text-black rounded flex items-center gap-2"
                    >
                      <FiSave /> Save Draft
                    </button>

                    <button
                      onClick={() => {
                        // revert to original persisted post (undo local edits)
                        cancelEditing();
                      }}
                      className="px-3 py-2 bg-white text-gray-700 rounded flex items-center gap-2 border"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero if first block is image */}
          {firstIsImage && !isEditing && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <BlogImage
                src={firstBlock.url}
                alt={firstBlock.caption}
                caption={firstBlock.caption}
                hero
              />
            </div>
          )}

          {/* If editing and the first block was an image, still show hero preview from draft (if available) */}
          {firstIsImage &&
            isEditing &&
            draftBlocks &&
            draftBlocks[0] &&
            draftBlocks[0].type === "image" &&
            draftBlocks[0].url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <BlogImage
                  src={draftBlocks[0].url}
                  alt={draftBlocks[0].caption}
                  caption={draftBlocks[0].caption}
                  hero
                />
              </div>
            )}

          {/* Article body */}
          <div className="max-w-3xl mx-auto text-gray-900">
            {(displayBlocks || []).map((block, i) => {
              if (block.type === "text") {
                const isFirstText =
                  (displayBlocks || []).findIndex((b) => b.type === "text") ===
                  i;
                return (
                  <section id={`section-${i}`} key={i} className="mb-8">
                    {!isEditing ? (
                      <p
                        className={`text-lg md:text-xl leading-relaxed font-serif whitespace-pre-line ${
                          isFirstText
                            ? "first-letter:text-6xl first-letter:font-extrabold first-letter:text-sky-700 first-letter:float-left first-letter:mr-4 first-letter:leading-[0.8]"
                            : ""
                        }`}
                        style={{ maxWidth: "65ch" }}
                      >
                        {block.value}
                      </p>
                    ) : (
                      <div className="relative bg-gray-50 p-4 rounded border">
                        <div className="flex items-start justify-between mb-2">
                          <label className="text-sm font-semibold">
                            Paragraph #{i + 1}
                          </label>
                          <button
                            onClick={() => deleteDraftBlock(i)}
                            className="text-red-500"
                            title="Delete paragraph"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          className="w-full p-3 border rounded resize-y"
                          rows={6}
                          value={block.value}
                          onChange={(e) => updateDraftText(i, e.target.value)}
                        />
                      </div>
                    )}
                  </section>
                );
              }

              if (block.type === "image") {
                // if first was hero and already displayed as hero, skip duplicate rendering for non-edit mode
                if (i === 0 && firstIsImage && !isEditing) {
                  return null;
                }

                return (
                  <section id={`section-${i}`} key={i} className="mb-12">
                    {!isEditing ? (
                      <div className="space-y-3">
                        <BlogImage
                          src={block.url}
                          alt={block.caption}
                          caption={block.caption}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded border">
                        <div className="flex items-start justify-between mb-2">
                          <label className="text-sm font-semibold">
                            Image #{i + 1}
                          </label>
                          <button
                            onClick={() => deleteDraftBlock(i)}
                            className="text-red-500"
                            title="Delete image"
                          >
                            ✕
                          </button>
                        </div>

                        {/* image preview */}
                        {block.url ? (
                          <img
                            src={block.url}
                            alt={block.caption || "image"}
                            className="w-full rounded-xl border mb-3"
                          />
                        ) : (
                          <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-500">
                            No image URL
                          </div>
                        )}

                        <input
                          className="w-full p-2 border rounded"
                          placeholder="Caption (editable)"
                          value={block.caption || ""}
                          onChange={(e) =>
                            updateDraftCaption(i, e.target.value)
                          }
                        />
                      </div>
                    )}
                  </section>
                );
              }

              return null;
            })}
          </div>

          {/* Draft saved banner + Publish button */}
          {draftSaved && (
            <div className="max-w-3xl mx-auto mt-6 p-4 rounded bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
              <div className="text-sm text-amber-800">
                Draft saved locally. Review then publish to make changes live.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="px-3 py-2 bg-white border rounded text-sm"
                >
                  Edit Draft
                </button>
                <button
                  onClick={publishChangesToFirestore}
                  disabled={publishing}
                  className="px-3 py-2 bg-sky-700 text-white rounded text-sm"
                >
                  {publishing ? "Publishing..." : "Publish Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Owner actions (edit/publish/delete) */}
          {!isEditing && !draftSaved && user?.uid === post.userId && (
            <div className="flex gap-3 mt-10 justify-end">
              <Link
                to={`/edit/${post.id}`}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <FiEdit /> Edit (Admin)
              </Link>
              <button
                onClick={handleDeletePost}
                className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </main>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">On this page</h3>
                <button
                  onClick={() => setTocOpen((s) => !s)}
                  className="text-sm text-sky-700"
                >
                  {tocOpen ? "Hide" : "Show"}
                </button>
              </div>

              {toc.length ? (
                <nav className={`text-sm space-y-2 ${!tocOpen && "lg:block"}`}>
                  {toc.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="block text-gray-600 hover:text-sky-700 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(t.id);
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                    >
                      {t.title}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-gray-500">No sections</p>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white/70 backdrop-blur shadow text-center">
              <p className="text-sm text-gray-700">Enjoying this article?</p>
              <button
                onClick={() => navigate("/about")}
                className="mt-3 px-4 py-2 bg-sky-700 text-white rounded-full text-sm"
              >
                About the author
              </button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

/* helpers */
function formatDate(date) {
  if (!date) return "";
  if (date.seconds)
    return new Date(date.seconds * 1000).toLocaleDateString("en-US");
  return new Date(date).toLocaleDateString("en-US");
}
