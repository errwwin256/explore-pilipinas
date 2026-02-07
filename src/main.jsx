import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom"; // <-- change here
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    {" "}
    {/* <-- change here */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>,
);
