import React from "react";
import loadingVideo from "../../assets/loading.mp4";

export default function Loading({
  fullScreen = true,
  text = "جاري التحميل...",
}) {
  if (fullScreen) {
    return (
      <div className="loading-container">
        <div className="flex flex-col items-center gap-lg">
          <video autoPlay loop muted playsInline className="loading-video">
            <source src={loadingVideo} type="video/mp4" />
          </video>
          <p className="text-lg text-secondary animate-pulse">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-xl gap-md">
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ width: 150, height: 150 }}
      >
        <source src={loadingVideo} type="video/mp4" />
      </video>
      <p className="text-secondary">{text}</p>
    </div>
  );
}
