import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/.netlify/functions/gallery-cloudinary");
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Failed to load images:", err);
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
            key={img.public_id}
            src={img.secure_url}
            alt=""
            className="rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
