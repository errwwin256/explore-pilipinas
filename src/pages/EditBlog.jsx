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
    const load = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setPost(data);
        setBlocks(data.blocks);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    const updatedBlocks = [];

    for (let block of blocks) {
      if (block.file) {
        const fd = new FormData();
        fd.append("file", block.file);
        fd.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );
        const up = await res.json();

        updatedBlocks.push({ ...block, url: up.secure_url });
      } else {
        updatedBlocks.push(block);
      }
    }

    await updateDoc(doc(db, "posts", id), {
      blocks: updatedBlocks,
    });

    navigate(`/post/${id}`);
  };

  if (!post) return <p className="pt-32 text-center">Loading...</p>;

  return (
    <div className="pt-28 max-w-4xl mx-auto px-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>

      {blocks.map((block, i) =>
        block.type === "text" ? (
          <textarea
            key={i}
            className="w-full p-3 border rounded"
            value={block.value}
            onChange={(e) => {
              const arr = [...blocks];
              arr[i].value = e.target.value;
              setBlocks(arr);
            }}
          />
        ) : (
          <div key={i} className="space-y-2">
            <img src={block.url} className="rounded shadow" alt="" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arr = [...blocks];
                arr[i].file = e.target.files[0];
                setBlocks(arr);
              }}
            />
            <input
              className="w-full border p-2"
              value={block.caption}
              onChange={(e) => {
                const arr = [...blocks];
                arr[i].caption = e.target.value;
                setBlocks(arr);
              }}
            />
          </div>
        )
      )}

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
