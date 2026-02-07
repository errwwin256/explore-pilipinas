import { useEffect, useState } from "react";

const FloatingBalloon = () => {
  const [visible, setVisible] = useState(false);
  const [floatUp, setFloatUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setFloatUp(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => setFloatUp(false), 900);
  };

  return (
    <div>
      {visible && (
        <div
          className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 
          transition-opacity duration-500 
          ${visible ? "opacity-100" : "opacity-0"} 
          z-50 select-none`}
        >
          {/* Tooltip */}
          <span className="absolute -top-8 right-1 bg-black text-white text-xs py-1 px-2 rounded-md opacity-80">
            Back to top
          </span>

          {/* Floating Image Button */}
          <img
            src="/dive.png"
            alt="Back to top"
            onClick={handleClick}
            className={`w-14 h-14 sm:w-16 sm:h-16 cursor-pointer drop-shadow-2xl 
              transition-all duration-700
              hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(0,167,255,0.9)]
              animate-bounce-slow
              ${
                floatUp
                  ? "-translate-y-10 opacity-0"
                  : "translate-y-0 opacity-100"
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default FloatingBalloon;
