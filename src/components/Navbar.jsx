import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_LINKS_BASE = [
  { path: "/", label: "Home" },
  { path: "/blog", label: "Blog" },
  { path: "/about", label: "About" },
];

export default function Navbar() {
  const NAV_HEIGHT_DESKTOP = 96; // approx px (h-24 + py)
  const NAV_HEIGHT_MOBILE = 64; // approx px (h-16 + py)
  const { user, logout } = useAuth(); // keep your auth shape: { user, logout }
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef({}); // map path -> element
  const pillRef = useRef(null);
  const linksContainerRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    // update pill on route change after DOM updates
    requestAnimationFrame(() => updatePill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Scroll-aware: shrink + transparency
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update pill position & size
  const updatePill = () => {
    const currentPath = location.pathname;
    const activeEl = linksRef.current[currentPath];
    const container = linksContainerRef.current;

    if (!pillRef.current || !container) return;

    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();

      const left = elRect.left - containerRect.left;
      const width = elRect.width;
      pillRef.current.style.transform = `translateX(${left}px)`;
      pillRef.current.style.width = `${Math.max(24, width)}px`;
      pillRef.current.style.opacity = "1";
    } else {
      // hide pill if no matching element (e.g., admin link not present)
      pillRef.current.style.opacity = "0";
    }
  };

  // Recompute on resize (desktop layout changes)
  useEffect(() => {
    const onResize = () => {
      updatePill();
    };
    window.addEventListener("resize", onResize);
    // initial
    updatePill();
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to register link refs
  const setLinkRef = (path) => (el) => {
    if (el) linksRef.current[path] = el;
  };

  // active class fallback for mobile menu where the pill is not used
  const mobileActiveClass = (path) =>
    location.pathname === path
      ? "bg-white/90 text-blue-700 rounded-xl px-3 py-2 shadow-sm"
      : "text-white/95";

  // Desktop link classes (we keep text white; pill provides the active background)
  const desktopLinkClass =
    "relative z-10 px-3 py-2 rounded-xl text-white/95 focus:outline-none focus:ring-2 focus:ring-white/40";

  return (
    <header aria-label="Main navigation">
      <nav
        ref={navRef}
        role="navigation"
        className={`fixed left-0 top-0 w-full z-50 transition-all duration-300
          ${
            scrolled
              ? "py-2 bg-gradient-to-r from-[#00c4cc66] via-[#007fff66] to-[#4ba3f766]/60 backdrop-blur-sm transform-gpu shadow-lg"
              : "py-4 bg-gradient-to-r from-[#00c4cc88] via-[#007fff88] to-[#4ba3f788] backdrop-blur-lg"
          }`}
      >
        {/* ☁️ Image Clouds Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 opacity-80">
          {/* Cloud Left */}
          <img
            src="/images/cloud-left.png" // ⬅️ Update to your cloud image path
            alt="Cloud Left"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[260px] animate-[cloudFloat_18s_linear_infinite]"
          />

          {/* Cloud Right */}
          <img
            src="/images/cloud-right.png" // ⬅️ Update to your cloud image path
            alt="Cloud Right"
            className="absolute right-0 top-1/3 w-[260px] animate-[cloudFloatReverse_22s_linear_infinite]"
          />
        </div>

        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Explore-Pilipinas home"
            onClick={() => setMenuOpen(false)}
            className="
    relative select-none
    inline-block
    transition-transform duration-300
    hover:scale-110
    focus:outline-none focus:ring-2 focus:ring-white/40

    /* Idle shine glow */
    animate-shimmer-slow
  "
          >
            <img
              src="/Explore-Pilipinas.png"
              alt="Explore-Pilipinas Logo"
              className="
    max-h-16 md:max-h-20 lg:max-h-24
    scale-110 md:scale-125 lg:scale-150
    w-auto object-contain
    drop-shadow-[0_4px_18px_rgba(255,255,255,0.7)]
    [filter:drop-shadow(0_0_15px_rgba(255,255,255,0.85))]
    transition-all
  "
              draggable="false"
            />

            {/* Shine Reflex Overlay */}
            <span
              aria-hidden="true"
              className="
      absolute inset-0 pointer-events-none
      bg-gradient-to-r from-white/70 via-transparent to-transparent
      opacity-50 blur-sm rounded-lg
      translate-x-[-180%]
      transition-transform duration-[2200ms] ease-out
      hover:translate-x-[180%]
    "
            />
          </Link>

          {/* Desktop links (with container used for pill positioning) */}
          <div className="hidden md:flex items-center relative">
            <div
              ref={linksContainerRef}
              className="flex items-center space-x-4 relative"
            >
              {/* pill — absolute, soft glass */}
              <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute left-0 top-0 h-full rounded-full bg-white/35 backdrop-blur-xl backdrop-brightness-125 shadow-[0_6px_22px_rgba(2,6,23,0.3)] transition-all duration-300 ease-out -z-10"
                style={{
                  width: 0,
                  transform: "translateX(0px)",
                  opacity: 0,
                }}
              />
              {NAV_LINKS_BASE.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  ref={setLinkRef(link.path)}
                  className={desktopLinkClass}
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  <span className="relative z-10 select-none">
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Admin visible only for logged-in user */}
              {user && (
                <Link
                  to="/admin"
                  ref={setLinkRef("/admin")}
                  className={desktopLinkClass}
                  aria-current={
                    location.pathname === "/admin" ? "page" : undefined
                  }
                >
                  <span className="relative z-10 select-none">Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right side: desktop actions (Logout if user) */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <button
                onClick={() => {
                  logout();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
              >
                Logout
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden text-white text-3xl"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Mobile toggle (visible on small screens) */}
          <div className="md:hidden">
            <button
              className="text-white text-3xl"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu — smooth slide-down with blur */}
        <div
          id="mobile-menu"
          role="menu"
          aria-hidden={!menuOpen}
          className={`md:hidden overflow-hidden transition-all duration-350
            ${menuOpen ? "max-h-96 opacity-100 py-5" : "max-h-0 opacity-0"}
            bg-gradient-to-b from-[#00c4ccdd] via-[#007fffcc] to-[#4ba3f7cc] backdrop-blur-md`}
        >
          <div className="px-6">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS_BASE.map((link) => (
                <li key={`m-${link.path}`}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-white/30 ${mobileActiveClassFallback(
                      location.pathname,
                      link.path
                    )}`}
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg text-white/95 focus:outline-none focus:ring-2 focus:ring-white/30 ${mobileActiveClassFallback(
                        location.pathname,
                        "/admin"
                      )}`}
                      role="menuitem"
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );

  // Helper placed here to keep JSX above tidy
  function mobileActiveClassFallback(currentPath, linkPath) {
    return currentPath === linkPath
      ? "bg-white/90 text-blue-700"
      : "hover:bg-white/20";
  }
}
