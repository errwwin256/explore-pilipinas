import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DEALS } from "../data/deals";

const DEALS_PER_PAGE = 10;

export default function TravelDeals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  // Filter + sort (memoized)
  const filteredDeals = useMemo(() => {
    const q = query.trim().toLowerCase();

    const visible = DEALS.filter((d) => {
      const haystack = `${d.title} ${d.excerpt} ${d.source}`.toLowerCase();
      return q ? haystack.includes(q) : true;
    });

    // Sort: non-expired first, then soonest expiry first
    return visible.sort((a, b) => {
      const aExpired = a.expires < today;
      const bExpired = b.expires < today;

      if (aExpired !== bExpired) return aExpired ? 1 : -1;
      return a.expires.localeCompare(b.expires);
    });
  }, [query, today]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDeals.length / DEALS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * DEALS_PER_PAGE;
  const currentDeals = filteredDeals.slice(
    startIndex,
    startIndex + DEALS_PER_PAGE,
  );

  const showingFrom = filteredDeals.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + DEALS_PER_PAGE, filteredDeals.length);

  // When search changes, go back to page 1
  const onSearchChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  // Page buttons (simple)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const windowSize = 5;
    const start = Math.max(1, safePage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);

    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [safePage, totalPages]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Travel Deals</h1>
          <p className="mt-2 text-gray-600">
            Promos and discounts we’ve spotted. Click a deal to view details.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-[320px]">
          <label className="block text-sm font-medium text-gray-700">
            Search deals
          </label>
          <input
            value={query}
            onChange={onSearchChange}
            placeholder="Try: Pampanga, hotel, flight…"
            className="mt-2 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-6 text-sm text-gray-600">
        Showing <span className="font-medium">{showingFrom}</span>–{" "}
        <span className="font-medium">{showingTo}</span> of{" "}
        <span className="font-medium">{filteredDeals.length}</span> deals
      </div>

      {/* Deals Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {currentDeals.map((d) => {
          const isExpired = d.expires < today;

          return (
            <Link
              key={d.slug}
              to={`/travel-deals/${d.slug}`}
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={d.image}
                  alt={d.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge */}
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs text-gray-800 shadow">
                    {d.source}
                  </span>
                  {isExpired && (
                    <span className="rounded-full bg-black/80 px-3 py-1 text-xs text-white shadow">
                      Expired
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h2 className="font-semibold">{d.title}</h2>

                {/* Keep cards consistent */}
                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                  {d.excerpt}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  Expires: <span className="font-medium">{d.expires}</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredDeals.length === 0 && (
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center text-gray-600">
          No deals found. Try a different keyword.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-4 py-2 rounded-lg ${
                p === safePage ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
