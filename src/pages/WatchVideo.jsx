import { Link, useParams } from "react-router-dom";
import { VIDEOS } from "../data/videos";

export default function WatchVideo() {
  const { slug } = useParams();
  const video = VIDEOS.find((v) => v.slug === slug);

  if (!video) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-32 pb-16">
        <h1 className="text-2xl font-bold">Video not found</h1>
        <p className="mt-2 text-gray-600">
          The video may have been removed or the link is wrong.
        </p>
        <Link
          className="mt-6 inline-block underline text-blue-600"
          to="/videos"
        >
          ← Back to Videos
        </Link>
      </div>
    );
  }

  // Related: share at least one tag
  const related = VIDEOS.filter(
    (v) => v.slug !== video.slug && v.tags.some((t) => video.tags.includes(t)),
  ).slice(0, 6);

  const relatedFallback = VIDEOS.filter((v) => v.slug !== video.slug).slice(
    0,
    6,
  );
  const list = related.length ? related : relatedFallback;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">
      <Link className="text-sm underline text-blue-600" to="/videos">
        ← Back to Videos
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Player */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border bg-black shadow-md">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl font-bold leading-snug">
            {video.title}
          </h1>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {video.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Description box */}
          <div className="mt-5 rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Posted: {video.date}</p>

            <p className="mt-3 text-gray-700 whitespace-pre-line">
              {video.description}
            </p>

            <a
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-white font-medium hover:bg-red-700 transition"
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>

        {/* Related */}
        <aside className="lg:col-span-4">
          <h2 className="text-lg font-bold">Related Videos</h2>

          <div className="mt-4 flex flex-col gap-4">
            {list.map((v) => (
              <Link
                key={v.slug}
                to={`/videos/${v.slug}`}
                className="flex gap-3 rounded-2xl border bg-white p-3 shadow-sm hover:shadow-md transition"
              >
                <div className="h-20 w-32 overflow-hidden rounded-xl bg-gray-100 shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt={v.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-snug">
                    {v.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {v.tags.slice(0, 3).join(" • ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{v.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
