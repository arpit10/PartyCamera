import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Gallery from "./components/Gallery.jsx";
import BabyFeud from "./pages/BabyFeud.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/baby-feud" element={<BabyFeud />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
