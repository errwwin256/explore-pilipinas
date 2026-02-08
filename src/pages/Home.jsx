import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

// Hero images
import img1 from "../assets/images/hero1.jpg";
import img2 from "../assets/images/hero2.jpg";
import img3 from "../assets/images/hero3.jpg";
import img4 from "../assets/images/hero4.jpg";
import img5 from "../assets/images/hero5.jpg";
import img6 from "../assets/images/hero6.jpg";
import img7 from "../assets/images/hero7.jpg";
import img8 from "../assets/images/hero8.jpg";
import img9 from "../assets/images/hero9.jpg";
import img10 from "../assets/images/hero10.jpg";

const Home = () => {
  const slides = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const [index, setIndex] = useState(0);

  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero slider interval
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      5000,
    );
    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch posts (safe against unmount)
  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔥 TRENDING: by views (real trending)
        const featuredQ = query(
          collection(db, "posts"),
          orderBy("views", "desc"),
          limit(3),
        );
        const featuredSnap = await getDocs(featuredQ);
        if (!mounted) return;

        const featured = featuredSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setFeaturedPosts(featured);

        // Recent posts (exclude the featured last doc when possible)
        let recent = [];
        if (featuredSnap.docs.length < 3) {
          const recentQ = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit(6),
          );
          const recentSnap = await getDocs(recentQ);
          if (!mounted) return;

          recent = recentSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        } else {
          const lastDoc = featuredSnap.docs[featuredSnap.docs.length - 1];
          const recentQ = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(6),
          );
          const recentSnap = await getDocs(recentQ);
          if (!mounted) return;

          recent = recentSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }

        setRecentPosts(recent);
      } catch (err) {
        console.error("Home load error:", err);
        if (!mounted) return;
        setError("Failed to load posts. Please refresh and try again.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 rounded-xl h-64" />
  );

  if (error) {
    return (
      <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white rounded-2xl shadow p-6">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800 transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-sky-100 min-h-screen">
      {/* Responsive Spacer for fixed navbar */}
      <div className="h-6 md:h-12 lg:h-14" />

      {/* Hero Slider */}
      <section className="relative h-[50vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden flex items-center justify-center text-center">
        {slides.map((img, i) => (
          <img
            key={i}
            src={img}
            loading="lazy"
            className={`absolute w-full h-full object-cover transition-opacity duration-[1500ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            alt="Philippines travel"
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-white px-4 z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-6xl font-extrabold drop-shadow-lg">
            Explore the Beauty of the Philippines
          </h1>
          <p className="mt-3 text-lg md:text-xl max-w-2xl mx-auto">
            Discover stunning destinations and hidden gems!
          </p>
        </div>
      </section>

      {/* Trending Stories */}
      <section className="px-4 sm:px-8 lg:px-20 mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">
          🔥 Trending Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            : featuredPosts.map((post) => {
                const firstImage = post.blocks?.find(
                  (b) => b.type === "image",
                )?.url;

                return (
                  <div key={post.id} className="relative group">
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Trending
                    </span>
                    <BlogCard
                      id={post.id}
                      title={post.title}
                      featuredImage={firstImage}
                      province={post.province}
                      excerpt={post.excerpt}
                      createdAt={post.createdAt}
                      tags={post.tags || []}
                      views={post.views ?? 0}
                      trending={post.trending}
                    />
                  </div>
                );
              })}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/blog"
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition"
          >
            View All Stories →
          </Link>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="px-4 sm:px-8 lg:px-20 mt-10 mb-20 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6">
          Recent Blog Posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : recentPosts.map((post) => {
                const firstImage = post.blocks?.find(
                  (b) => b.type === "image",
                )?.url;

                return (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    featuredImage={firstImage}
                    province={post.province}
                    excerpt={post.excerpt}
                    createdAt={post.createdAt}
                    tags={post.tags || []}
                    views={post.views ?? 0}
                    trending={post.trending}
                  />
                );
              })}
        </div>
      </section>
    </div>
  );
};

export default Home;
