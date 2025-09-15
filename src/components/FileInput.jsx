import "./styles/FileInput.css";

export default function FileInput({ onFileChange }) {
  return (
    <div className="file-input rounded-2xl overflow-hidden shadow mb-3 bg-white p-4 text-center">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="block w-full"
      />
      <p className="file-input-text text-xs text-neutral-600 mt-2">
        Use your phone camera; the photo compresses before upload.
      </p>
    </div>
  );
}
