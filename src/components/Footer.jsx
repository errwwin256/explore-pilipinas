import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "@emailjs/browser"; // ✅ Added EmailJS
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  const [captcha, setCaptcha] = useState(null);
  const [hoveredClam, setHoveredClam] = useState(null);

  // ⭐⭐⭐ EMAILJS FIX — MUST BE ADDED ⭐⭐⭐
  emailjs.init("gyCopgvHSFxdcNkcy"); // <-- FIXED: prevents Gmail API error 412

  // ✅ Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captcha) {
      alert("⚠️ Please verify the Captcha!");
      return;
    }

    const templateParams = {
      name,
      email,
      message,
      time: new Date().toLocaleString(),
      year: new Date().getFullYear(),
    };

    // ✅ EmailJS send
    emailjs
      .send(
        "service_r7preb7",
        "template_ctpltml",
        templateParams,
        "gyCopgvHSFxdcNkcy",
      )
      .then(() => {
        alert("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setCaptcha(null);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message. Please try again.");
      });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#20b995] to-[#15785c] text-white pt-20 overflow-hidden">
      {/* 🌊 Smooth Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180 z-0 pointer-events-none">
        <svg
          className="block w-[300%] h-28 animate-realWave"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0 49 C150 0 350 100 550 49 C750 0 950 100 1200 49 V120 H0 Z"
            fill="#48bf91"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 grid gap-12 md:grid-cols-3">
        {/* 🪸 Coral Reef Contact Info */}
        <div
          className="relative pl-6 border-l-4 border-[#ff4f5a] 
                     space-y-3 pb-6 animate-coralGlow"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-bubble"
              style={{
                bottom: `${10 + i * 15}px`,
                left: `${-10 - (i % 2) * 6}px`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          <h3 className="text-2xl font-bold text-orange-300 tracking-wide drop-shadow-md">
            Contact Info
          </h3>
          <p className="flex items-center gap-3 text-white opacity-95">
            🐚 erwingalura25@gmail.com
          </p>
          <p className="flex items-center gap-3 text-white opacity-95">
            🐠 0975-744-9954
          </p>
          <p className="flex items-center gap-3 text-white opacity-95">
            🌴 Angeles City, Pampanga, Philippines
          </p>

          <div className="absolute bottom-1 right-1 text-xl animate-starfishFloat">
            ⭐
          </div>
          <div className="absolute -right-6 bottom-8 w-6 h-6 animate-fishSwim">
            🐟
          </div>
        </div>

        {/* 🐚 Follow Me Column */}
        <div className="text-center md:text-left mt-3.5">
          <h3 className="text-2xl font-bold text-yellow-200 mb-8 drop-shadow-lg">
            Follow me on Socials!
          </h3>

          <div className="flex justify-center md:justify-start gap-5">
            {[
              { Icon: Facebook, link: "https://www.facebook.com/errwwin25/" },
              { Icon: Instagram, link: "https://www.instagram.com/errwwin25/" },
              { Icon: Youtube, link: "https://www.youtube.com/@ExplorePH25" },
              {
                Icon: Linkedin,
                link: "https://www.linkedin.com/in/errwwin25/",
              },
            ].map(({ Icon, link }, i) => (
              <div
                key={i}
                className="relative w-16 h-20 cursor-pointer"
                onMouseEnter={() => setHoveredClam(i)}
                onMouseLeave={() => setHoveredClam(null)}
              >
                <img
                  src={
                    hoveredClam === i
                      ? "/images/clam-open.png"
                      : "/images/clam-closed.png"
                  }
                  alt="clam shell"
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto transition-transform duration-500 pointer-events-none
            ${hoveredClam === i ? "rotate-[20deg]" : ""}`}
                />

                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-500
            ${
              hoveredClam === i ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
                >
                  <Icon className="w-5 h-5 text-[#1c725c]" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-5 rounded-xl backdrop-blur-lg space-y-4 shadow-lg
                     max-w-full sm:max-w-md md:max-w-lg mx-auto w-full"
        >
          <h3 className="text-xl font-semibold text-center">
            Send Me a Message
          </h3>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)} // added
            className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-[#20b995] outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // added
            className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-[#20b995] outline-none"
            required
          />

          {/* Message */}
          <textarea
            rows="4"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // added
            className="w-full p-3 rounded-lg bg-white text-black focus:ring-2 focus:ring-[#20b995] outline-none resize-none"
            required
          />

          <div className="responsive-recaptcha w-fit overflow-hidden">
            <ReCAPTCHA
              sitekey="6LdYMw0sAAAAADxbfdgjC5D_mta-kEHLgXbIhd5I"
              onChange={(v) => setCaptcha(v)}
            />
          </div>

          <button className="w-full py-3 bg-white text-[#107055] font-bold rounded-lg hover:bg-gray-200 transition">
            Send Message
          </button>
        </form>
      </div>

      {/* footer bottom section (unchanged) */}
      <div className="relative w-full mt-4">
        <div className="absolute bottom-0 left-0 w-full h-32 z-0 overflow-hidden">
          <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#d4b483] via-[#cfa87b] to-transparent"></div>

          <svg
            className="absolute bottom-0 left-[12%] h-24 w-10 opacity-80"
            viewBox="0 0 20 100"
          >
            <path
              d="M10 100 C2 80 18 70 10 50 C2 30 18 20 10 0"
              stroke="#0a5c47"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <svg
            className="absolute bottom-0 left-[28%] h-28 w-10 opacity-70"
            viewBox="0 0 20 100"
          >
            <path
              d="M10 100 C5 85 15 75 10 60 C5 40 15 30 10 0"
              stroke="#0e7a5d"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <svg
            className="absolute bottom-0 right-[20%] h-24 w-16 opacity-90"
            viewBox="0 0 50 100"
          >
            <path
              d="M25 100 L25 60 M25 80 L10 70 M25 70 L40 60 M25 60 L20 45 M25 60 L30 45"
              stroke="#ff6868"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <svg
            className="absolute bottom-0 right-[7%] h-28 w-20 opacity-95"
            viewBox="0 0 60 100"
          >
            <path
              d="M30 100 L30 55 M30 80 L15 70 M30 70 L45 60 M30 60 L20 50 M30 60 L40 45"
              stroke="#e64a4a"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-0 w-2 h-2 bg-white rounded-full opacity-70 animate-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 2.5}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        <div className="flex justify-center gap-6 relative z-20">
          <a
            href="/privacy-policy"
            className="text-blue-700 text-sm hover:underline"
          >
            Privacy Policy
          </a>
          <a href="/terms" className="text-blue-700 text-sm hover:underline">
            Terms & Conditions
          </a>
        </div>

        <p className="text-center text-sm text-white opacity-90 relative z-20 mt-2">
          © {new Date().getFullYear()} Explore Pilipinas — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
