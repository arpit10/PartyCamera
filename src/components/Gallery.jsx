import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/.netlify/functions/gallery-cloudinary");
        const data = await res.json();
        setPhotos(data);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  if (loading) return <p className="text-center">Loading photos...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">📸 Event Gallery</h1>
      <Link to="/" className="mb-4 inline-block bg-black text-white px-3 py-1 rounded-lg shadow">
        Back to Camera
      </Link>
      {photos.length === 0 ? (
        <p className="text-center">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo.secure_url}
              alt="Event"
              className="w-full h-auto rounded-lg shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
