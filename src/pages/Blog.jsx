import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import BlogCard from "../components/BlogCard";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const postsPerPage = 6;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterProvince, setFilterProvince] = useState("All");

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const fetchInitialPosts = async () => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(postsPerPage),
    );
    const snap = await getDocs(q);

    const allSnap = await getDocs(collection(db, "posts"));
    setTotalPosts(allSnap.size);

    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLastDoc(snap.docs[snap.docs.length - 1]);
  };

  const fetchNextPage = async () => {
    if (!lastDoc) return;
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(postsPerPage),
    );
    const snap = await getDocs(q);

    const newPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setPosts([...posts, ...newPosts]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const textMatch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());

    const provinceMatch =
      filterProvince === "All" || post.province === filterProvince;

    return textMatch && provinceMatch;
  });

  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  const changePage = async (page) => {
    if (page > currentPage) await fetchNextPage();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const provinces = [
    "All",
    "Abra",
    "Agusan del Norte",
    "Agusan del Sur",
    "Aklan",
    "Albay",
    "Antique",
    "Apayao",
    "Aurora",
    "Basilan",
    "Bataan",
    "Batanes",
    "Batangas",
    "Benguet",
    "Biliran",
    "Bohol",
    "Bukidnon",
    "Bulacan",
    "Cagayan",
    "Camarines Norte",
    "Camarines Sur",
    "Camiguin",
    "Capiz",
    "Catanduanes",
    "Cavite",
    "Cebu",
    "Cotabato",
    "Davao de Oro",
    "Davao del Norte",
    "Davao del Sur",
    "Davao Occidental",
    "Davao Oriental",
    "Dinagat Islands",
    "Eastern Samar",
    "Guimaras",
    "Ifugao",
    "Ilocos Norte",
    "Ilocos Sur",
    "Iloilo",
    "Isabela",
    "Kalinga",
    "La Union",
    "Laguna",
    "Lanao del Norte",
    "Lanao del Sur",
    "Leyte",
    "Maguindanao del Norte",
    "Maguindanao del Sur",
    "Marinduque",
    "Masbate",
    "Misamis Occidental",
    "Misamis Oriental",
    "Mountain Province",
    "Negros Occidental",
    "Negros Oriental",
    "Northern Samar",
    "Nueva Ecija",
    "Nueva Vizcaya",
    "Occidental Mindoro",
    "Oriental Mindoro",
    "Palawan",
    "Pampanga",
    "Pangasinan",
    "Quezon",
    "Quirino",
    "Rizal",
    "Romblon",
    "Samar",
    "Sarangani",
    "Siquijor",
    "Sorsogon",
    "South Cotabato",
    "Southern Leyte",
    "Sultan Kudarat",
    "Sulu",
    "Surigao del Norte",
    "Surigao del Sur",
    "Tarlac",
    "Tawi-Tawi",
    "Zambales",
    "Zamboanga del Norte",
    "Zamboanga del Sur",
    "Zamboanga Sibugay",
  ];

  return (
    <div className="w-full overflow-x-hidden bg-sky-100 min-h-screen">
      {/* Responsive Spacer */}
      <div className="h-12 md:h-20 lg:h-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-0">
        <h1 className="text-4xl font-bold text-sky-800 mt-4 mb-6 text-center">
          Explore Philippines
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mb-10 justify-center w-full">
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search travel stories..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-auto px-4 py-2 rounded-xl border shadow-sm"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
          >
            {provinces.map((prov) => (
              <option key={prov}>{prov}</option>
            ))}
          </select>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentPosts.map((post) => {
            const img = post.blocks.find((b) => b.type === "image")?.url;
            return (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                featuredImage={img}
                province={post.province}
                excerpt={post.excerpt}
              />
            );
          })}
        </div>

        {/* Bubble Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-12 mb-20">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className="w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-transform hover:scale-110
        ${
          currentPage === i + 1
            ? "bg-blue-600 text-white shadow-lg scale-110"
            : "bg-white text-blue-700 shadow"
        }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
