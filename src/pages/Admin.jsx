// Admin.jsx — Pro Editor Upgrade (multi-image, compression, progress, preview)
import React, { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Notes:
 * - Make sure CLOUD_NAME and UPLOAD_PRESET match your Cloudinary settings.
 * - Compression settings (maxWidth, quality) are adjustable below.
 */

const CLOUD_NAME = "dzmppwyfy"; // <-- keep your cloud name
const UPLOAD_PRESET = "exploreph_preset"; // <-- keep your unsigned preset

const MAX_IMAGE_WIDTH = 2000; // px - resize wide images to this width
const IMAGE_QUALITY = 0.78; // 0..1 - compression quality
const MAX_FILE_MB = 10; // quick client-side reject if file > 10MB (optional)

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" />;

  // Editor state
  const [title, setTitle] = useState("");
  const [province, setProvince] = useState("");
  // initial block: text
  const [blocks, setBlocks] = useState([{ type: "text", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // progress map: index -> percent (0-100)
  const [progressMap, setProgressMap] = useState({});
  const inputFileRefs = useRef({}); // optional refs for individual file inputs

  // helpers
  const addTextBlock = () =>
    setBlocks((s) => [...s, { type: "text", value: "" }]);
  const addImageBlock = () =>
    setBlocks((s) => [
      ...s,
      { type: "image", file: null, preview: "", caption: "" },
    ]);

  const deleteBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setProgressMap((p) => {
      const copy = { ...p };
      delete copy[index];
      return copy;
    });
  };

  // Resize + compress image using canvas
  const compressImage = (
    file,
    maxWidth = MAX_IMAGE_WIDTH,
    quality = IMAGE_QUALITY
  ) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Canvas is empty"));
              // preserve original type as jpeg for cross-browser (Cloudinary accepts)
              resolve(
                new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
                  type: "image/jpeg",
                })
              );
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = (e) => reject(new Error("Image load failed"));
        // read file to dataURL
        const reader = new FileReader();
        reader.onload = (ev) => {
          img.src = ev.target.result;
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      } catch (err) {
        reject(err);
      }
    });

  // Upload with progress using XMLHttpRequest (returns secure_url)
  const uploadToCloudinary = (file, onProgress) =>
    new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText);
            if (resp.secure_url) resolve(resp);
            else reject(new Error("Cloudinary upload missing secure_url"));
          } catch (err) {
            reject(new Error("Invalid Cloudinary response"));
          }
        } else {
          // try parse error body
          try {
            const errBody = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errBody.error?.message ||
                  `Upload failed with status ${xhr.status}`
              )
            );
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () =>
        reject(new Error("Network error during image upload"));
      xhr.send(fd);
    });

  const handleFileChange = (index, file) => {
    const updated = [...blocks];
    if (!file) return;
    // optional quick client-side size check
    const mb = file.size / 1024 / 1024;
    if (mb > MAX_FILE_MB) {
      // still allow but warn — you can choose to reject
      setErrorMsg(
        `Warning: selected file is ${
          Math.round(mb * 10) / 10
        } MB. It will be compressed but may still be large.`
      );
    } else {
      setErrorMsg("");
    }

    // set preview immediately
    updated[index] = {
      ...updated[index],
      file,
      preview: URL.createObjectURL(file),
    };
    setBlocks(updated);
  };

  // Core publish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Please provide a title.");
      return;
    }

    setLoading(true);
    setProgressMap({});

    try {
      const formattedBlocks = [];

      // iterate in order to preserve blocks array order
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.type === "text") {
          // normalize newlines & keep order
          formattedBlocks.push({ type: "text", value: block.value || "" });
        } else if (block.type === "image") {
          // always push an image block object — with url if exists (empty string allowed)
          if (!block.file) {
            // no file selected — push placeholder empty or skip (we push empty so order preserved)
            formattedBlocks.push({
              type: "image",
              url: "",
              caption: block.caption || "",
            });
            continue;
          }

          // compress image
          let compressedFile = block.file;
          try {
            compressedFile = await compressImage(block.file);
          } catch (err) {
            // fallback: use original file if compression fails
            console.warn("Compression failed, using original file:", err);
            compressedFile = block.file;
          }

          // Upload and track progress
          const onProgress = (percent) => {
            setProgressMap((prev) => ({ ...prev, [i]: percent }));
          };

          const resp = await uploadToCloudinary(compressedFile, onProgress);
          const secureUrl = resp.secure_url;

          if (!secureUrl) throw new Error("Upload returned no secure_url");

          formattedBlocks.push({
            type: "image",
            url: secureUrl,
            caption: block.caption || "",
          });

          // ensure progress shows 100% for that index
          setProgressMap((p) => ({ ...p, [i]: 100 }));
        }
      }

      // Add to Firestore
      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        province: province.trim(),
        blocks: formattedBlocks,
        author: user.email,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // success — navigate to blog
      navigate("/blog");
    } catch (err) {
      console.error("Publish error:", err);
      setErrorMsg(err.message || "Upload failed — try again.");
    } finally {
      setLoading(false);
    }
  };

  // small UI helpers
  const updateTextValue = (index, value) => {
    const updated = [...blocks];
    updated[index].value = value;
    setBlocks(updated);
  };

  const updateCaption = (index, caption) => {
    const updated = [...blocks];
    updated[index].caption = caption;
    setBlocks(updated);
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-sky-600 mb-4">
          Add New Blog (Pro Editor)
        </h1>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Blog Title"
            className="w-full p-3 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <input
            placeholder="Province"
            className="w-full p-3 border rounded"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={loading}
          />

          {/* Editor Blocks */}
          <div className="space-y-4">
            {blocks.map((block, i) =>
              block.type === "text" ? (
                <div key={i} className="relative bg-gray-50 p-3 rounded border">
                  <label className="text-xs text-gray-500">
                    Paragraph #{i + 1}
                  </label>
                  <textarea
                    className="w-full p-3 mt-2 border rounded resize-y"
                    placeholder="Write content..."
                    value={block.value}
                    onChange={(e) => updateTextValue(i, e.target.value)}
                    disabled={loading}
                    rows={4}
                  />
                  <button
                    type="button"
                    onClick={() => deleteBlock(i)}
                    className="absolute top-2 right-2 text-red-500 font-bold"
                    title="Delete block"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div key={i} className="relative bg-gray-50 p-3 rounded border">
                  <label className="text-xs text-gray-500">
                    Image #{i + 1}
                  </label>

                  {/* File input */}
                  <input
                    ref={(el) => (inputFileRefs.current[i] = el)}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(i, e.target.files?.[0])}
                    disabled={loading}
                    className="mt-2"
                  />

                  {/* Preview + caption + progress */}
                  <div className="mt-3 space-y-2">
                    {blocks[i].preview ? (
                      <div className="flex items-start gap-4">
                        <img
                          src={blocks[i].preview}
                          alt="preview"
                          className="w-36 rounded border"
                        />
                        <div className="flex-1">
                          <input
                            className="w-full p-2 border rounded"
                            placeholder="Image caption (will appear below image)"
                            value={blocks[i].caption || ""}
                            onChange={(e) => updateCaption(i, e.target.value)}
                            disabled={loading}
                          />
                          {/* Upload progress (if uploading) */}
                          {progressMap[i] != null && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                                <div
                                  style={{ width: `${progressMap[i]}%` }}
                                  className="h-2 bg-sky-500 transition-all"
                                />
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {progressMap[i]}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No file selected yet
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteBlock(i)}
                    className="absolute top-2 right-2 text-red-500 font-bold"
                    title="Delete block"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              )
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={addTextBlock}
              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-60"
              disabled={loading}
            >
              ➕ Text
            </button>

            <button
              type="button"
              onClick={addImageBlock}
              className="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-60"
              disabled={loading}
            >
              🖼️ Image
            </button>

            <button
              type="button"
              className="ml-auto text-sm text-gray-600 underline"
              onClick={() => setBlocks([{ type: "text", value: "" }])}
              disabled={loading}
              title="Reset editor"
            >
              Reset Editor
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white w-full p-3 rounded mt-2 disabled:opacity-70"
          >
            {loading ? "Publishing… Please wait" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
