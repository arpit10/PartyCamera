import React from "react";

export default function CameraOptions({ onNativeCapture }) {
  return (
    <div className="mb-3 text-center">
      {/* Native camera option for iOS/Android */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onNativeCapture(e.target.files[0]);
          }
        }}
        className="hidden"
        id="native-camera-input"
      />
      <label
        htmlFor="native-camera-input"
        className="cursor-pointer px-4 py-2 rounded-2xl bg-pink-500 text-white shadow hover:bg-pink-600"
      >
        Open Phone Camera
      </label>
    </div>
  );
}
