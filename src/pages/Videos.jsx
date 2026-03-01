import { Link } from "react-router-dom";
import { VIDEOS } from "../data/videos";

export default function Videos() {
  const sorted = [...VIDEOS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="mt-2 text-gray-600">
            Watch travel videos, guides, and quick tips around the Philippines.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {sorted.length} video{sorted.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((v) => (
          <Link
            key={v.slug}
            to={`/videos/${v.slug}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              {/* Auto YouTube thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

              {/* Play badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/60 px-4 py-2 text-white text-sm shadow">
                  ▶ Watch
                </div>
              </div>
            </div>

            <div className="p-4">
              <h2 className="font-semibold leading-snug">{v.title}</h2>

              <div className="mt-2 flex flex-wrap gap-2">
                {v.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-500">Posted: {v.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
