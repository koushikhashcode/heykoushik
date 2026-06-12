import React from "react";
import "./Preloader.css";
import preloaderImg from "../../assets/preloader.jpg";

const Preloader = ({ isLoading }) => {
  return (
    <div className={`preloader ${!isLoading ? "fade-out" : ""}`}>
      <img src={preloaderImg} alt="Loading..." className="preloader-image" />
    </div>
  );
};

export default Preloader;
