import { FaFacebook, FaPhone } from "react-icons/fa";
import logo from "../assets/logo.png";
export default function Footer() {
  return (
    <div
      className="w-100"
      style={{
        backgroundColor: "rgb(220, 194, 149)",
        minHeight: "100px",
        padding: "20px 0",
        color: "white",
      }}
    >
      <h4 className="text-center fw-normal fs-5 mb-0">Maneki-Chan</h4>
      <div className="d-flex justify-content-center">
        <img
          src={logo}
          style={{ width: "3em", height: "auto", margin: "0 auto" }}
        />
      </div>
      <div className="d-flex justify-content-center">
        <span className="d-flex align-items-center">
          <FaFacebook size={20} />
          <a
            href="https://www.facebook.com/profile.php?id=61560746542491"
            className="ms-2 me-5"
            style={{ color: "white" }}
          >
            Maneki-chan
          </a>
        </span>
        <span className="d-flex align-items-center">
          <FaPhone size={20} className="me-2" />
          0253937094
        </span>
      </div>
    </div>
  );
}
