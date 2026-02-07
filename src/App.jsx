import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import About from "./pages/About";
import EditBlog from "./pages/EditBlog";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

import FloatingBalloon from "./components/FloatingBalloon"; // 👈 ADDED THIS

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />

          {/* Fixed Route Here */}
          <Route path="/post/:id" element={<BlogPost />} />

          <Route path="/login" element={<Login />} />

          {/* Admin Create */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Edit Post */}
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* 👇 Floating Clickable Animation Image */}
      <FloatingBalloon />

      <Footer />
    </div>
  );
};

export default App;
