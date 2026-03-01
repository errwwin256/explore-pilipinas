import { Link, useParams } from "react-router-dom";
import { DEALS } from "../data/deals";

export default function Deal() {
  const { slug } = useParams();
  const deal = DEALS.find((d) => d.slug === slug);

  const today = new Date().toISOString().slice(0, 10);

  if (!deal) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-32 pb-16">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p className="mt-2 text-gray-600">
          This promo may have expired or the link is wrong.
        </p>

        <Link
          className="mt-6 inline-block underline text-blue-600"
          to="/travel-deals"
        >
          ← Back to Travel Deals
        </Link>
      </div>
    );
  }

  const isExpired = deal.expires < today;

  // Simple related deals (same source, excluding current)
  const related = DEALS.filter(
    (d) => d.slug !== deal.slug && d.source === deal.source,
  ).slice(0, 3);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {
      alert("Copy failed. You can copy the URL from the address bar.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-32 pb-20">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-3">
        <Link className="text-sm underline text-blue-600" to="/travel-deals">
          ← Back to Travel Deals
        </Link>

        <button
          onClick={copyLink}
          className="text-sm rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200 transition"
          type="button"
        >
          Copy link
        </button>
      </div>

      {/* Card */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-md">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full bg-gray-100">
          <img
            src={deal.image}
            alt={deal.title}
            className="h-full w-full object-cover"
          />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs text-gray-800 shadow">
              {deal.source}
            </span>
            {isExpired && (
              <span className="rounded-full bg-black/80 px-3 py-1 text-xs text-white shadow">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold">{deal.title}</h1>

          <p className="mt-4 text-gray-700 text-lg whitespace-pre-line">
            {deal.excerpt}
          </p>

          {/* Info Box */}
          <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm">
            <p className="text-gray-600">
              Expires: <span className="font-semibold">{deal.expires}</span>
            </p>
            <p className="mt-2 text-gray-600">
              Tip: Always double-check promo terms on the official page.
            </p>
          </div>

          {/* CTA */}
          {isExpired ? (
            <button
              disabled
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-300 px-6 py-3 text-white font-medium cursor-not-allowed"
              type="button"
            >
              Promo Expired
            </button>
          ) : (
            <a
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
            >
              Go to Promo ↗
            </a>
          )}
        </div>
      </div>

      {/* Related Deals */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold">More from {deal.source}</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((d) => (
              <Link
                key={d.slug}
                to={`/travel-deals/${d.slug}`}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[16/9] bg-gray-100">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Expires: {d.expires}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
