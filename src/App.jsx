import { useEffect, useRef, useState } from "react";
import ProgressBar from "./components/ProgressBar.jsx";
import { uploadPhotos } from "./components/UploadManager.jsx";
import clouds from "./assets/clouds.png";
import CameraOptions from "./components/CameraOptions.jsx";
import { Link } from "react-router-dom";

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [useLiveCamera, setUseLiveCamera] = useState(true);
  const [facingMode, setFacingMode] = useState("environment"); // 👈 toggle between back/front
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (useLiveCamera) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [useLiveCamera, facingMode]);

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setStatus("Camera not available. Try Native Camera instead.");
      setUseLiveCamera(false);
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }

  function toggleCamera() {
    setFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  }

  function dataURLFromCanvas(videoEl, maxW = 1600, quality = 0.85) {
    const canvas = canvasRef.current;
    const w = videoEl.videoWidth;
    const h = videoEl.videoHeight;
    if (!w || !h) return null;

    const ratio = Math.min(1, maxW / w);
    const targetW = Math.round(w * ratio);
    const targetH = Math.round(h * ratio);

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, targetW, targetH);
    return canvas.toDataURL("image/jpeg", quality);
  }

  function dataURLFromFile(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result); // 👈 no compression for native camera
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  function snapFromCamera() {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const dataUrl = dataURLFromCanvas(videoEl); // 👈 compressed only here
    if (dataUrl) {
      const filename = `${
        userName ? `${userName}_` : ""
      }party_${Date.now()}.jpg`;
      downloadPhoto(dataUrl, filename); // Only download for app captures
      setPhotos((prev) => [...prev, { preview: dataUrl, filename, compressed: true }]);
    }
  }

  function downloadPhoto(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleFileInput(e) {
    const files = e.target.files;
    if (!files || !files.length) return;
    const newPhotos = [];
    for (const file of files) {
      const dataUrl = await dataURLFromFile(file);
      const filename = `${
        userName ? `${userName}_` : ""
      }party_${Date.now()}.jpg`;
      newPhotos.push({ preview: dataUrl, filename, compressed: false }); // 👈 mark native as not compressed
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${clouds})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4">
        {/* Header */}
        <header className="text-center my-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 drop-shadow-md">
            Welcome to Baby Jain’s Gender Reveal 🎉
          </h1>
          <p className="text-sm font-semibold bg-yellow-100 text-yellow-800 p-2 rounded-lg mt-2 text-center shadow-sm">
            Don’t worry if the upload fails — all photos are automatically saved to your device.
          </p>
          <p className="text-sm text-neutral-600 mt-3">
            Snap multiple pics and send to the host’s album.
          </p>
        </header>

        {/* Username input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        {/* Native Camera Option (iOS/Android) */}
        <CameraOptions
          onNativeCapture={async (file) => {
            // Keep native captures full quality
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target.result;
              const filename = `${userName ? `${userName}_` : ""}party_${Date.now()}.jpg`;

              // Save to device/gallery
              downloadPhoto(dataUrl, filename);

              // Mark as "native" so we know not to compress
              setPhotos((prev) => [
                ...prev,
                { preview: dataUrl, filename, isNative: true },
              ]);
            };
            reader.readAsDataURL(file);
          }}
        />
        {/* Mode buttons */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <button
            className={`px-3 py-2 rounded-2xl shadow ${
              useLiveCamera ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => setUseLiveCamera(true)}
          >
            App Camera
          </button>
          <button
            className={`px-3 py-2 rounded-2xl shadow ${
              !useLiveCamera ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => setUseLiveCamera(false)}
          >
            Upload From Device
          </button>
        </div>

        {/* Camera or File Input */}
        {useLiveCamera ? (
          <div className="relative rounded-2xl overflow-hidden shadow mb-3 bg-black aspect-video">
            <video ref={videoRef} playsInline className="w-full h-full object-cover" />
            <button
              onClick={toggleCamera}
              className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white"
            >
              <span className="text-xl">↺</span>
            </button>
            <p className="text-xs text-neutral-600 mt-2">
              Opens your phone’s native camera app (better for iPhone users).
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow mb-3 bg-white p-4 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="block w-full"
            />

          </div>
        )}

        {/* Photo previews */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p.preview} alt="preview" className="w-full rounded shadow" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Buttons + Progress */}
        <div className="mb-3 flex flex-col gap-2">
          <div className="flex gap-2">
            {useLiveCamera && (
              <button
                className="flex-1 rounded-2xl py-3 shadow bg-white"
                onClick={snapFromCamera}
              >
                Snap Picture
              </button>
            )}
            {photos.length > 0 && (
              <button
                className={`flex-1 rounded-2xl py-3 shadow ${
                  uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
                }`}
                disabled={uploading}
                onClick={async () => {
                  setUploading(true);
                  await uploadPhotos(photos, setProgress, setStatus, setPhotos);
                  setProgress(0);
                  setUploading(false);
                }}
              >
                {uploading ? "Uploading..." : "Upload All"}
              </button>
            )}
          </div>

          {photos.length > 0 && <ProgressBar progress={progress} />}
          {status && <p className="text-center text-sm">{status}</p>}
        </div>

        <footer className="text-center text-xs text-neutral-500 mt-6">
          Disposable camera app created by Arpit Jain
          <Link to="/gallery" className="inline-block mt-2 bg-white text-black px-3 py-1 rounded-lg shadow">
            View Gallery 📸
          </Link>
        </footer>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
