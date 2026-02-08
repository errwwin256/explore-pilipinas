import { useEffect, useRef, useState } from "react";

const About = () => {
  // Typing effect refs
  const textRef = useRef(null);
  const typedRef = useRef(false);

  // Water interaction state
  const [open, setOpen] = useState(false);
  const [ripple, setRipple] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typedRef.current) return;
    if (!textRef.current) return;

    typedRef.current = true;

    const el = textRef.current;
    const text = "Hey, I’m Erwin Galura!";
    let index = 0;

    const type = () => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        setTimeout(type, 85);
      } else {
        el.classList.remove("typing");
        el.classList.add("fade-out-cursor");
      }
    };

    type();
  }, []);

  const handleWaterClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setRipple({ x, y });

    // ⏱️ Let ripple expand BEFORE water drops
    setTimeout(() => {
      setOpen(true);
    }, 180); // 👈 sweet spot
  };

  return (
    <main
      role="main"
      aria-label="About Erwin - Explore the Philippines"
      className="relative px-6 pt-28 md:pt-32 pb-36 text-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Smooth Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/70 via-teal-100/40 to-amber-50/20 blur-2xl" />

        {/* Sunlight Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-radial from-amber-200/50 via-transparent to-transparent blur-3xl opacity-60" />

        {/* Light Sand at Bottom */}
        <div className="absolute bottom-0 w-full h-56 bg-gradient-to-t from-amber-100/80 to-transparent" />

        {/* Soft Ocean Wave */}
        <svg
          className="absolute bottom-0 w-[160%] left-1/2 -translate-x-1/2 text-sky-200 opacity-70"
          viewBox="0 0 800 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0 90 C100 140 200 40 300 90 C400 140 500 40 600 90 C700 140 800 40 900 90 V120 H0 Z" />
        </svg>
      </div>

      {/* Profile Image */}
      <section aria-labelledby="about-me">
        <div className="opacity-0 animate-fadeIn">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto mb-10 p-[6px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(#ff5757 0% 25%, #3b82f6 25% 50%, #facc15 50% 75%, #ffffff 75% 100%)",
              }}
            />
            <img
              src="/about-profile.jpg"
              alt="Erwin Galura - Traveler & Web Developer"
              className="relative z-10 w-full h-full rounded-full object-cover shadow-xl"
            />
          </div>
        </div>

        <h1
          id="about-me"
          ref={textRef}
          className="typing text-4xl sm:text-5xl md:text-6xl font-extrabold text-sky-700 mb-5 tracking-tight inline-block"
        ></h1>

        <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          A traveler exploring the hidden paradise of the Philippines - from
          pristine beaches to cultural wonders. I inspire others to explore,
          embrace local tourism, and celebrate our vibrant culture.
        </p>
      </section>

      {/* Quick Travel Facts */}
      <section
        aria-labelledby="travel-facts"
        className="mt-28 opacity-0 animate-fadeInUp relative"
      >
        <h2
          id="travel-facts"
          className="text-3xl md:text-4xl font-extrabold text-sky-700 mb-12 drop-shadow-sm"
        >
          Quick Travel Facts
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto"
          role="list"
        >
          {[
            {
              icon: "🌴",
              title: "Provinces Explored",
              subtitle: "12+ local journeys",
            },
            {
              icon: "📸",
              title: "Travel Photography",
              subtitle: "Capturing the best scenes",
            },
            {
              icon: "🏄‍♂️",
              title: "Adventure Lover",
              subtitle: "Food + thrills!",
            },
          ].map((item, index) => (
            <article
              role="listitem"
              key={index}
              className="
    relative p-10 rounded-3xl 
    bg-gradient-to-br from-[rgba(255,255,255,0.35)] to-[rgba(173,216,230,0.20)]
    backdrop-blur-3xl
    border border-white/40
    shadow-[0_8px_30px_rgba(0,0,0,0.12)]
    hover:shadow-[0_12px_45px_rgba(135,206,250,0.35)]
    transition-all duration-500
    overflow-hidden
  "
            >
              {/* ✨ SHIMMER OVERLAY */}
              <div
                className="
      absolute inset-0 
      bg-gradient-to-br from-white/10 via-white/50 to-white/10
      opacity-0 animate-[shimmerSweep_3s_linear_infinite]
      mix-blend-overlay pointer-events-none
      [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]
    "
              ></div>

              <div className="text-6xl mb-4 drop-shadow-sm animate-bounce-slow">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-sky-800 tracking-wide mb-1">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {item.subtitle}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Mission - Full Flame Cinematic */}
      <section
        aria-labelledby="mission"
        className="mt-32 px-6 opacity-0 animate-fadeInUp relative"
      >
        <div
          className="
      relative max-w-4xl mx-auto 
      rounded-3xl p-[2px] overflow-hidden 
      bg-gradient-to-br from-orange-500/70 via-red-500/60 to-yellow-400/60 
      animate-flameGlow
      shadow-[0_10px_40px_rgba(255,87,34,0.25)]
    "
        >
          {/* Particle Sparks */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="flame-particle"></div>
            <div className="flame-particle delay-200"></div>
            <div className="flame-particle delay-500"></div>
            <div className="flame-particle delay-700"></div>
          </div>

          {/* Inner Glass Panel */}
          <div
            className="
        relative bg-white/45 backdrop-blur-xl
        border border-white/40
        rounded-[inherit]
        py-14 px-10 text-center
        shadow-[inset_0_0_30px_rgba(255,255,255,0.25)]
      "
          >
            <h2
              id="mission"
              className="
          text-3xl md:text-4xl font-extrabold 
          bg-gradient-to-r from-red-600 via-orange-600 to-yellow-400
          bg-clip-text text-transparent drop-shadow-lg
          inline-block animate-underlineFlame
        "
            >
              My Travel Mission
            </h2>

            <p className="text-gray-900/90 text-lg leading-relaxed font-medium max-w-3xl mx-auto mt-4">
              Traveling the Philippines doesn’t have to be complicated or
              expensive - it’s about discovering the stories behind every
              destination. From peaceful hidden beaches where the waves whisper
              against the shore, to lively towns filled with festivals, music,
              and food that feels like home, every place has a unique charm
              waiting to be experienced.
              <br />
              <br />
              My mission is to help you explore more - not by spending more, but
              by making smarter choices, supporting local communities, and
              embracing the journey with curiosity. Whether you’re chasing
              waterfalls in the mountains, wandering ancient streets, or meeting
              kindhearted locals who instantly feel like family, each adventure
              brings us closer to the heart of our culture.
              <br />
              <br />
              Join me as we uncover these hidden gems, discover travel tips for
              every type of explorer, and celebrate the beauty of the
              Philippines - a paradise that deserves to be explored, respected,
              and loved. Let’s create stories you’ll never forget and memories
              that will inspire your next adventure.
            </p>
          </div>

          {/* Heatwave Distortion Layer */}
          <div className="heatwave"></div>
        </div>
      </section>

      {/* Skills – Earth Element Style */}
      <section
        aria-labelledby="skills"
        className="mt-32 opacity-0 animate-fadeInUp relative"
      >
        <h2
          id="skills"
          className="
      text-3xl md:text-4xl font-extrabold text-center
      bg-gradient-to-r from-green-700 to-emerald-500
      bg-clip-text text-transparent drop-shadow-md
      mb-14 tracking-tight
    "
        >
          What I Do
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto"
          role="list"
        >
          {[
            {
              icon: "📸",
              title: "Content Creator",
              desc: "Capturing moments & storytelling",
            },
            {
              icon: "🌍",
              title: "Travel Guide",
              desc: "Helping others explore hidden gems",
            },
            {
              icon: "💻",
              title: "Web Developer",
              desc: "Creating clean & modern websites",
            },
          ].map((item, i) => (
            <article
              key={i}
              role="listitem"
              tabIndex={0}
              className="
          group relative h-72 rounded-3xl
          overflow-hidden cursor-pointer
          bg-amber-50/45 backdrop-blur-xl
          shadow-[0_10px_25px_rgba(0,0,0,0.28)]
          border border-amber-900/30
          transition-all duration-500
          hover:-translate-y-4 hover:scale-[1.02]
          hover:shadow-[0_20px_35px_rgba(0,0,0,0.35)]
          focus-visible:-translate-y-4 focus-visible:scale-[1.02]
          focus-visible:shadow-[0_20px_35px_rgba(0,0,0,0.35)]
          focus-visible:outline-none
        "
            >
              {/* ===== TOP SLIDE (ICON – moves FIRST) ===== */}
              <div
                className="
            absolute inset-0 flex flex-col items-center justify-center
            transition-transform duration-500 ease-in-out
            group-hover:-translate-y-full
            group-focus-visible:-translate-y-full
          "
              >
                <div className="text-6xl mb-4 drop-shadow-sm">{item.icon}</div>
                <h3 className="text-xl font-bold text-green-900 tracking-wide">
                  {item.title}
                </h3>
              </div>

              {/* ===== BOTTOM SLIDE (TEXT – delayed) ===== */}
              <div
                className="
            absolute inset-0 flex flex-col items-center justify-center
            translate-y-full
            transition-transform duration-500 ease-in-out delay-100
            group-hover:translate-y-0
            group-focus-visible:translate-y-0
            px-8 text-center
          "
              >
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-green-900/80 text-sm font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Moss Glow */}
              <div
                className="
            absolute inset-0 rounded-3xl opacity-0
            transition-opacity duration-500
            group-hover:opacity-30
            group-focus-visible:opacity-30
            bg-[radial-gradient(circle_at_center,rgba(74,160,71,0.5),transparent)]
          "
              />

              {/* Rock Edge Border */}
              <div
                className="
            absolute inset-0 rounded-3xl
            border-2 border-amber-800/20
            transition-all duration-500
            group-hover:border-green-700/40
            group-focus-visible:border-green-700/40
          "
              />
            </article>
          ))}
        </div>
      </section>

      {/* ⚡ Support Me – Lightning Elemental */}
      <section
        aria-labelledby="support"
        className="mt-32 mb-10 opacity-0 animate-fadeInUp relative"
      >
        <div
          tabIndex={0}
          className="
      group relative max-w-xl mx-auto text-center
      rounded-3xl
      bg-gradient-to-br from-sky-50/70 via-white/60 to-indigo-50/60
      backdrop-blur-xl
      border border-sky-300/40
      shadow-[0_20px_60px_-20px_rgba(56,189,248,0.5)]
      px-6 sm:px-8 py-12
      transition-all duration-500
      hover:scale-[1.015]
      focus-visible:scale-[1.015]
      overflow-hidden
    "
        >
          {/* ⚡ LIGHTNING BORDER */}
          <svg
            className="
        absolute -inset-4
        w-[calc(100%+2rem)] h-[calc(100%+2rem)]
        pointer-events-none
        opacity-0
        group-hover:opacity-100
        group-focus-visible:opacity-100
        transition-opacity duration-200
      "
            viewBox="0 0 400 300"
            fill="none"
          >
            <defs>
              <filter id="lightningGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 🌩️ BIG STRIKE */}
            <path
              d="M10 40 L80 10 L140 60 L210 20 L280 80 L350 30"
              className="strike-glow"
            />
            <path
              d="M10 40 L80 10 L140 60 L210 20 L280 80 L350 30"
              className="strike-core"
            />

            {/* ⚡ TOP */}
            <path
              d="M20 24 L60 12 L100 28 L150 14 L200 30 L260 10 L320 26 L380 18"
              className="lightning-glow random-1"
            />
            <path
              d="M20 24 L60 12 L100 28 L150 14 L200 30 L260 10 L320 26 L380 18"
              className="lightning-core random-1"
            />

            {/* ⚡ RIGHT */}
            <path
              d="M380 20 L392 70 L372 120 L392 170 L370 230 L388 280"
              className="lightning-glow random-2"
            />
            <path
              d="M380 20 L392 70 L372 120 L392 170 L370 230 L388 280"
              className="lightning-core random-2"
            />

            {/* ⚡ BOTTOM */}
            <path
              d="M380 280 L320 292 L260 270 L200 292 L150 270 L90 290 L20 276"
              className="lightning-glow random-3"
            />
            <path
              d="M380 280 L320 292 L260 270 L200 292 L150 270 L90 290 L20 276"
              className="lightning-core random-3"
            />

            {/* ⚡ LEFT */}
            <path
              d="M20 280 L8 220 L28 170 L6 120 L26 70 L12 24"
              className="lightning-glow random-4"
            />
            <path
              d="M20 280 L8 220 L28 170 L6 120 L26 70 L12 24"
              className="lightning-core random-4"
            />
          </svg>

          {/* ⚡ CONTENT */}
          <h2
            id="support"
            className="relative z-10 text-3xl md:text-4xl font-extrabold
      bg-gradient-to-r from-sky-600 to-indigo-500
      bg-clip-text text-transparent
      mb-5"
          >
            Support My Adventures
          </h2>

          <p className="relative z-10 text-gray-700 text-lg mb-6">
            Want to support my travels and content? You can send a little love
            via <span className="font-semibold text-sky-700">GCash</span> ⚡
          </p>

          {/* ⚡ BIG QR */}
          <div className="relative z-20 flex justify-center">
            <div className="rounded-3xl bg-white p-3 shadow-2xl ring-2 ring-sky-300/50">
              <img
                src="/gcash-qr.jpg"
                alt="Send support via GCash QR"
                className="
            w-72
            sm:w-80
            md:w-[22rem]
            lg:w-[24rem]
            rounded-2xl
          "
              />
            </div>
          </div>

          <p className="relative z-10 text-sm text-gray-600 mt-4">
            Scan using your GCash app 📱
          </p>

          <p className="relative z-10 text-gray-800 font-semibold mt-3">
            GCash Number: <span className="text-sky-700">0975-744-9954</span>
          </p>
        </div>
      </section>

      {/* 🌊 WATER ELEMENT – ADVERTISE WITH ME */}
      <section className="mt-24 sm:mt-32 px-4 sm:px-6">
        <div className="relative max-w-4xl mx-auto flex justify-center">
          {/* OUTER WRAPPER (controls size) */}
          <div
            className={`
        relative overflow-hidden
        transform-gpu transition-all duration-700
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          open
            ? "w-full rounded-3xl shadow-2xl"
            : "w-56 h-56 rounded-full shadow-2xl cursor-pointer"
        }
      `}
            onClick={!open ? handleWaterClick : undefined}
          >
            {/* INNER WATER BODY */}
            <div
              className={`
          relative w-full h-full
          transition-all duration-700
          ${
            open
              ? "bg-[radial-gradient(120%_100%_at_50%_-20%,rgba(255,255,255,0.35),transparent_60%),linear-gradient(to_bottom,#7dd3fc,#38bdf8,#0369a1)] border border-sky-300/60 py-16 px-6 sm:px-10"
              : "bg-gradient-to-b from-sky-200 to-sky-400"
          }
        `}
            >
              {/* 🌊 WATER MOTION (OPEN ONLY) */}
              {open && (
                <>
                  <div className="absolute inset-0 opacity-30 animate-waterSurface mix-blend-overlay" />
                  <div className="absolute inset-0 caustics opacity-20 mix-blend-soft-light animate-caustics" />
                </>
              )}

              {/* 💧 RIPPLE (CLOSED ONLY) */}
              {!open && (
                <span
                  className="absolute ripple"
                  style={{
                    left: `${ripple.x}%`,
                    top: `${ripple.y}%`,
                  }}
                />
              )}

              {/* 🌊 CLOSED STATE – FLOATING DROPLET */}
              {!open && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="
                flex flex-col items-center justify-center
             w-44 h-44

                rounded-full
                bg-white/30 backdrop-blur-xl
                border border-white/40
           shadow-[0_25px_60px_-18px_rgba(0,140,220,0.75)]
                animate-float
                text-white text-center
                select-none
              "
                  >
                    <h2 className="text-2xl font-extrabold tracking-wide leading-tight">
                      Advertise
                    </h2>

                    <p className="text-base font-semibold opacity-95 mt-1">
                      Tap to Pop!
                    </p>

                    <span className="mt-3 text-xl animate-bounce">⬇️</span>
                  </div>
                </div>
              )}

              {/* 🌊 OPEN STATE CONTENT */}
              <div
                className={`
            relative z-10 transition-all duration-700 delay-200
            ${
              open
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-6 pointer-events-none"
            }
          `}
              >
                {/* HEADER */}
                <div className="mb-8 text-center">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-sky-900">
                    Let’s Work Together
                  </h3>
                  <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400" />
                </div>

                {/* DESCRIPTION */}
                <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 sm:p-8 shadow-lg">
                  <p className="text-sky-900 text-base sm:text-lg font-medium text-center leading-relaxed">
                    Reach travelers and adventure lovers across the Philippines
                    through authentic storytelling, immersive visuals, and
                    high-impact brand collaborations.
                  </p>
                </div>

                {/* SERVICES */}
                <section className="mt-10 sm:mt-12">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
                    {[
                      {
                        title: "Sponsored Blog Posts",
                        desc: "Story-driven brand features",
                        icon: "📝",
                      },
                      {
                        title: "Product Reviews & Features",
                        desc: "Honest, experience-based reviews",
                        icon: "🔍",
                      },
                      {
                        title: "Banner Promotions",
                        desc: "High-visibility placements",
                        icon: "📣",
                      },
                      {
                        title: "Social Media Campaigns",
                        desc: "Multi-platform reach",
                        icon: "📱",
                      },
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="
                    group relative flex items-start gap-4
                    rounded-2xl
                    bg-white/65 backdrop-blur-xl
                    border border-sky-200/70
                    px-5 py-5
                    shadow-[0_10px_30px_-15px_rgba(0,120,200,0.4)]
                    transition-all duration-300
                    active:scale-[0.97]
                    sm:hover:-translate-y-1 sm:hover:shadow-lg
                  "
                      >
                        <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-xl shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-sky-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-sky-700/80 mt-1">
                            {item.desc}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* BACK BUTTON */}
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setOpen(false)}
                    className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-full
                bg-white/70 backdrop-blur-xl
                border border-sky-300
                text-sky-700 font-semibold
                shadow-md transition
                active:scale-95 sm:hover:scale-105
              "
                  >
                    🌊 Back to surface
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌪 WIND STYLE - AFFILIATE PARTNERSHIPS */}
      <section
        aria-labelledby="affiliate"
        className="mt-32 opacity-0 animate-fadeInUp px-6"
      >
        <div className="relative max-w-4xl mx-auto">
          <div
            className="
        relative text-center
        bg-white/50 backdrop-blur-2xl
        border border-sky-200/60
        rounded-3xl
        shadow-[0_30px_80px_-30px_rgba(120,180,255,0.6)]
        py-16 px-6 sm:px-10
        overflow-hidden
      "
          >
            {/* 🌬 WIND FLOW (BLUE AIR) */}
            <div className="absolute inset-0 wind-flow opacity-40" />
            <div className="absolute inset-0 wind-flow-2 opacity-30" />

            {/* 🍃 LEAVES */}
            <span className="leaf leaf-1">🍃</span>
            <span className="leaf leaf-2">🍂</span>
            <span className="leaf leaf-3">🍃</span>
            <span className="leaf leaf-4">🍁</span>

            {/* 🌪 ICON */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-white/70 backdrop-blur-xl flex items-center justify-center shadow-md animate-float">
              🌪️
            </div>

            <h2
              id="affiliate"
              className="text-3xl md:text-4xl font-extrabold text-sky-800 tracking-wide"
            >
              Affiliate Partnerships
            </h2>

            <p className="mt-6 text-sky-900 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
              I work with trusted travel brands to bring you hotel deals,
              unforgettable adventures, and essential travel gear — while
              helping support this site.
            </p>

            <ul className="mt-12 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
              {[
                { label: "Hotels & Travel Bookings", icon: "🏨" },
                { label: "Tours & Adventures", icon: "🧭" },
                { label: "Travel Gear & Essentials", icon: "🎒" },
                { label: "Insurance & Travel Cards", icon: "💳" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="
        group relative
        flex items-center gap-4
        px-6 py-4
        rounded-2xl
        bg-white/65 backdrop-blur-xl
        border border-sky-200/70
        shadow-[0_8px_30px_-12px_rgba(120,180,255,0.5)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_18px_40px_-15px_rgba(120,180,255,0.8)]
        active:scale-[0.98]
      "
                >
                  {/* 🌬 wind glow */}
                  <span
                    className="
          absolute inset-0 rounded-2xl
          bg-gradient-to-r from-transparent via-sky-200/40 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
        "
                  />

                  {/* ICON */}
                  <div
                    className="
          relative z-10
          w-10 h-10
          rounded-full
          bg-white/80 backdrop-blur
          flex items-center justify-center
          shadow-sm
          text-xl
          animate-float
        "
                  >
                    {item.icon}
                  </div>

                  {/* LABEL */}
                  <span className="relative z-10 text-sky-900 font-semibold text-base sm:text-lg">
                    {item.label}
                  </span>

                  {/* ARROW */}
                  <span
                    className="
          relative z-10 ml-auto
          text-sky-400
          transition-transform duration-300
          group-hover:translate-x-1
        "
                  >
                    ➜
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-sky-900 text-sm font-medium opacity-70">
              *Some links may earn commissions at no extra cost to you.*
            </p>
          </div>
        </div>
      </section>

      {/* 🤝 TRUSTED AFFILIATE PARTNERS */}
      <div className="mt-20">
        {/* TITLE */}
        <h3
          className="
      text-base sm:text-lg md:text-xl
      font-extrabold
      tracking-[0.22em]
      text-sky-800
      uppercase
      mb-12
      text-center
    "
        >
          Trusted Travel Partners
        </h3>

        <div
          className="
      grid grid-cols-2 gap-8
      sm:grid-cols-2 sm:gap-12
      lg:flex lg:justify-center lg:gap-20
    "
        >
          {[
            {
              name: "Trip.com",
              logo: "/affiliates/tripcom.svg",
              link: "https://www.trip.com",
              brand: "from-blue-500 to-sky-400",
            },
            {
              name: "Klook",
              logo: "/affiliates/klook.svg",
              link: "https://www.klook.com",
              brand: "from-orange-400 to-red-400",
            },
            {
              name: "Agoda",
              logo: "/affiliates/agoda.svg",
              link: "https://www.agoda.com",
              brand: "from-indigo-500 to-blue-500",
            },
            {
              name: "Booking.com",
              logo: "/affiliates/booking.svg",
              link: "https://www.booking.com",
              brand: "from-sky-600 to-indigo-600",
            },
          ].map((partner, i) => (
            <a
              key={i}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={partner.name}
              onClick={() => {
                // 🔍 PER-LOGO ANALYTICS TRACKING
                if (window.gtag) {
                  window.gtag("event", "affiliate_click", {
                    partner: partner.name,
                    placement: "about_affiliate_partners",
                  });
                }
              }}
              className="
          flex items-center justify-center
          transition-transform duration-300
          hover:scale-105
          active:scale-95
        "
            >
              {/* RING WRAPPER */}
              <div
                className={`
            relative flex items-center justify-center
            rounded-full
            p-[3px]
            bg-gradient-to-br ${partner.brand}
            shadow-lg
          `}
              >
                {/* INNER CIRCLE */}
                <div
                  className="
              flex items-center justify-center
              rounded-full bg-white
              shadow-inner

              w-28 h-28
              sm:w-36 sm:h-36
              lg:w-40 lg:h-40
            "
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} affiliate partner`}
                    className="
                object-contain
                w-20 h-20
                sm:w-24 sm:h-24
                lg:w-28 lg:h-28
              "
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-8 text-xs sm:text-sm text-gray-600 text-center">
          Disclosure: Some links on this site are affiliate links. I may earn a
          commission at no extra cost to you.
        </p>
      </div>
    </main>
  );
};

export default About;
