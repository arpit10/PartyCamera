import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clouds from "../assets/clouds.png"; // 👈 adjust if path differs

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/.netlify/functions/gallery-cloudinary");
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Gallery fetch failed", err);
      }
    }
    loadImages();
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-center p-4"
      style={{
        backgroundImage: `url(${clouds})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 drop-shadow-md">
            Gender Reveal Pictures 💖💙
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            A collection of all the fun moments captured by friends & family!
          </p>
        </header>

        {/* Grid of Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.asset_id}
              className="aspect-square rounded-xl border-4 border-white shadow-md overflow-hidden"
            >
              <img
                src={img.secure_url}
                alt={img.public_id}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Footer with Back Button */}
        <footer className="text-center mt-8">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-pink-400 to-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105"
          >
            ⬅ Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
