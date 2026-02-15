import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUD_NAME = "dzmppwyfy";
const UPLOAD_PRESET = "exploreph_preset";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (!mounted) return;

      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setPost(data);
        setBlocks(data.blocks || []);
      } else {
        setPost({ notFound: true });
      }
    };

    if (id) load();
    return () => (mounted = false);
  }, [id]);
  if (!post) return <p className="pt-32 text-center">Loading...</p>;
  if (post.notFound)
    return <p className="pt-32 text-center text-red-600">Post not found.</p>;

  const handleSave = async () => {
    const updatedBlocks = [];

    for (const block of blocks) {
      if (block.type === "image" && block.file) {
        const fd = new FormData();
        fd.append("file", block.file);
        fd.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd },
        );
        const up = await res.json();

        updatedBlocks.push({
          type: "image",
          url: up.secure_url || block.url || "",
          caption: block.caption || "",
        });
      } else if (block.type === "image") {
        // keep image as-is, but remove temp fields like file
        updatedBlocks.push({
          type: "image",
          url: block.url || "",
          caption: block.caption || "",
        });
      } else {
        // text
        updatedBlocks.push({
          type: "text",
          value: block.value || "",
        });
      }
    }

    await updateDoc(doc(db, "posts", id), { blocks: updatedBlocks });

    // ✅ go to canonical page
    const href = post?.slug ? `/post/${post.slug}` : `/post-id/${id}`;
    navigate(href);
  };

  return (
    <div className="pt-28 max-w-4xl mx-auto px-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>

      {blocks.map((block, i) => (
        <div key={`${block.type}-${i}`}>
          {block.type === "text" ? (
            <textarea
              className="w-full p-3 border rounded"
              value={block.value || ""}
              onChange={(e) => {
                const arr = [...blocks];
                arr[i] = { ...arr[i], value: e.target.value };
                setBlocks(arr);
              }}
            />
          ) : (
            <div className="space-y-2">
              <img src={block.url} className="rounded shadow" alt="" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const arr = [...blocks];
                  arr[i] = { ...arr[i], file: e.target.files?.[0] || null };
                  setBlocks(arr);
                }}
              />
              <input
                className="w-full border p-2"
                value={block.caption || ""}
                onChange={(e) => {
                  const arr = [...blocks];
                  arr[i] = { ...arr[i], caption: e.target.value };
                  setBlocks(arr);
                }}
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-sky-700 text-white px-5 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditBlog;
