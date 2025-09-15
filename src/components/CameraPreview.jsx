import { useEffect } from "react";
import "./styles/CameraPreview.css";

export default function CameraPreview({ stream, videoRef }) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream, videoRef]);

  return (
    <div className="camera-preview rounded-2xl overflow-hidden shadow mb-3 bg-black aspect-video">
      <video ref={videoRef} playsInline className="w-full h-full object-cover" />
    </div>
  );
}
