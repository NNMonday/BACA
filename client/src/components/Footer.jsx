import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faFacebook, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div
      className="w-100 p-3 p-md-5 w-100 d-flex justify-content-md-between flex-column flex-md-row"
      style={{ backgroundColor: "#fff7eb" }}
    >
      <div className="d-flex footer-logo">
        <img
          src="https://raw.githubusercontent.com/NNMonday/Maneki-chan-content/main/og-preview.png"
          className="w-100"
          style={{ maxWidth: "200px", minWidth: "100px" }}
        />
        <div className="d-flex align-items-center">
          <span className="text-secondary">
            "Maneki-chan – Mang Hương Vị Nhật Bản Đến Gần Bạn"
          </span>
        </div>
      </div>
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-around my-3 me-5">
          <div>
            <strong>Liên lạc</strong>
          </div>
          <div>
            <span className="text-secondary">SĐT: 0334408599</span>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-around my-3 ">
          <div>
            <strong>Theo dõi chúng tôi</strong>
          </div>
          <div className="d-flex">
            <a
              href="https://www.facebook.com/profile.php?id=61560746542491"
              target="_blank"
            >
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <FontAwesomeIcon icon={faTiktok} size="2x" className="ms-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
