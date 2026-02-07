import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
  "white",
];

const MAX_ATTEMPTS = 5;

const Login = () => {
  const navigate = useNavigate();
  const correctButterfly = "white";

  const [showLogin, setShowLogin] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [positions, setPositions] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/admin");
    });
    return () => unsubscribe();
  }, [navigate]);

  const randomPosition = () => ({
    top: Math.random() * 80 + "vh",
    left: Math.random() * 80 + "vw",
  });

  useEffect(() => {
    const updatePositions = () => {
      setPositions(COLORS.map(() => randomPosition()));
    };

    updatePositions();
    const interval = setInterval(updatePositions, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (color) => {
    if (color === correctButterfly) {
      setShowLogin(true);
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch {
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;

        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setError("Too many failed attempts. Please try again later.");
        } else {
          setError(`Invalid login — Attempt ${newAttempts}/${MAX_ATTEMPTS}`);
        }

        return newAttempts;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    w-screen min-h-screen 
    overflow-hidden relative 
    flex justify-center items-center
    bg-forestNight bg-cover bg-center bg-no-repeat bg-fixed
    pt-24 md:pt-28 lg:pt-32
  "
    >
      {/* Fireflies */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-[1.5px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
        />
      ))}

      {/* BUTTERFLIES */}
      {!showLogin &&
        positions.length > 0 &&
        COLORS.map((color, i) => (
          <motion.div
            key={color}
            className="absolute cursor-pointer select-none"
            animate={positions[i]}
            transition={{ duration: 2, ease: "easeInOut" }}
            onClick={() => handleSelect(color)}
          >
            <motion.div
              className="text-4xl"
              animate={{
                rotate:
                  errorShake && color !== correctButterfly
                    ? [-12, 12, -12, 0]
                    : [-14, 14, -14],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: errorShake ? 0.4 : 1.2,
                repeat: errorShake ? 0 : Infinity,
                repeatType: "mirror",
              }}
            >
              🦋
            </motion.div>
          </motion.div>
        ))}

      {/* LOGIN MODAL */}
      {showLogin && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
      absolute 
      w-full max-w-sm p-8 
      rounded-3xl z-20 

      bg-white/10 
      backdrop-blur-xl 
      border border-white/20 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    "
        >
          <h2 className="text-2xl font-bold text-green-200 mb-4 text-center drop-shadow-md">
            Secure Admin Login
          </h2>

          {error && (
            <p className="text-red-300 text-sm mb-2 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/20 text-white placeholder-gray-200 px-3 py-2 rounded-lg mb-3 outline-none border border-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white/20 text-white placeholder-gray-200 px-3 py-2 rounded-lg mb-4 outline-none border border-white/30 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-lg text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              disabled={loading || isLocked}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading || isLocked
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-700/80 hover:bg-green-800"
              }`}
            >
              {loading ? "Checking..." : isLocked ? "Locked" : "Login"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
