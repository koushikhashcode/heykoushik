import React from "react";
import "./Preloader.css";
import signVideo from "../../assets/video/sign.mp4";

const Preloader = ({ isLoading }) => {
  return (
    <div className={`preloader ${!isLoading ? "fade-out" : ""}`}>
      <video
        src={signVideo}
        autoPlay
        loop
        muted
        playsInline
        className="preloader-video"
      />
    </div>
  );
};

export default Preloader;
