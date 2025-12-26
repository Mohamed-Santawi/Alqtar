import React from "react";
import loadingVideo from "../../assets/loading.mp4";

export default function Loading({
  fullScreen = true,
  text = "جاري التحميل...",
}) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-stone-100 z-50">
        <div className="flex flex-col items-center gap-8">
          <video autoPlay loop muted playsInline className="w-32 h-32">
            <source src={loadingVideo} type="video/mp4" />
          </video>
          <p className="text-lg text-gray-600 animate-pulse font-medium">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <video autoPlay loop muted playsInline className="w-32 h-32">
        <source src={loadingVideo} type="video/mp4" />
      </video>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
