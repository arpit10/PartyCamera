import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/.netlify/functions/gallery-cloudinary");
        const data = await res.json();
        setImages(data); // array of resources
      } catch (err) {
        console.error("Gallery fetch failed", err);
      }
    }
    loadImages();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((img) => (
          <img
            key={img.asset_id}
            src={img.secure_url}   // 👈 use secure_url directly
            alt={img.public_id}
            className="rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
