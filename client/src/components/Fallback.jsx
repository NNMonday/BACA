import React from "react";
import logo from "../assets/logo.png";

export default function Fallback() {
  return (
    <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      <img
        src={logo}
        style={{ maxWidth: "200px" }}
        className="jiggle w-25 mb-4"
        alt="logo"
      />
      <div className="progress w-25" style={{ maxWidth: "200px" }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
}
