import React, { useState } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const BlogCard = ({
  id, // Firestore doc id
  slug, // SEO slug
  title,
  excerpt,
  featuredImage,
  createdAt,
  tags = [],
  province,
  views: initialViews = 0,
  trending,
}) => {
  const [views, setViews] = useState(Number(initialViews) || 0);

  const href = slug ? `/post/${slug}` : `/post-id/${id}`; // ✅ DITO dapat

  const isNew = (() => {
    if (!createdAt) return false;
    let d;
    if (createdAt.seconds) d = new Date(createdAt.seconds * 1000);
    else d = new Date(createdAt);
    const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  const isTrending =
    trending === true || (typeof views === "number" && views >= 100);

  const incrementViews = async () => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { views: increment(1) });
      setViews((v) => v + 1);
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={href} className="block" onClick={incrementViews}>
        {/* Image wrapper */}
        <div className="relative group">
          <img
            src={featuredImage || "/images/placeholder.jpg"}
            alt={title}
            className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover transform group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Province */}
          {province && (
            <div className="absolute top-2 left-2 z-20">
              <span className="bg-sky-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                {province}
              </span>
            </div>
          )}

          {/* Views */}
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow">
              {views} views
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-10 right-2 flex flex-wrap gap-1 z-20">
            {isTrending && (
              <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                TRENDING
              </span>
            )}
            {isNew && (
              <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-md">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          <h3 className="text-base sm:text-lg font-bold text-sky-800 leading-tight line-clamp-2 break-words">
            {title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags?.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 sm:line-clamp-4 break-words">
            {excerpt}
          </p>

          {/* Date */}
          <div className="text-right text-[10px] sm:text-xs text-gray-500">
            {createdAt?.toDate
              ? createdAt.toDate().toLocaleDateString()
              : createdAt
                ? new Date(createdAt).toLocaleDateString()
                : ""}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
