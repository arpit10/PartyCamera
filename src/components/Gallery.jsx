import { useEffect, useState } from "react";
import { fetchCloudinaryImages } from "../../netlify/functions/cloudinary";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function loadImages() {
      const results = await fetchCloudinaryImages();
      setImages(results);
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
            src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${img.public_id}.jpg`}
            alt=""
            className="rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
