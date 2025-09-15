import "./styles/PhotoGallery.css";

export default function PhotoGallery({ photos, onRemove }) {
  return (
    <div className="photo-gallery">
      {photos.map((src, idx) => (
        <div key={idx} className="photo-container">
          <img src={src} alt={`photo-${idx}`} />
          <button className="remove-btn" onClick={() => onRemove(idx)}>✕</button>
        </div>
      ))}
    </div>
  );
}
