import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import { Badge } from "react-bootstrap"; // Import Badge component
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function MyNav() {
  const cartItemCount = JSON.parse(localStorage.getItem("cart"))
    ? JSON.parse(localStorage.getItem("cart")).length
    : 0;
  return (
    <Navbar
      expand="md"
      className="bg-white fixed-top shadow px-4 justify-content-between main-navbar"
    >
      <Navbar.Brand>
        <Link to={"/"} className="d-inline-block">
          <img src={logo} alt="Logo" width={60} />
        </Link>
      </Navbar.Brand>
      <div className="d-md-none">
        <Link to={"/cart"} className="me-4 my-3 position-relative">
          <FontAwesomeIcon icon={faCartShopping} className="text-baca fs-4" />
          <Badge
            bg="white"
            className="border border-black position-absolute translate-middle"
          >
            <span className="text-baca">{cartItemCount}</span>
          </Badge>
        </Link>
        <Navbar.Toggle aria-controls="my-nav" />
      </div>
      <Navbar.Collapse id="my-nav" className="fs-5">
        <Nav className="flex-grow-1 justify-content-center">
          <NavLink to={"/"} className="nav-link px-md-4">
            Trang chủ
          </NavLink>
          {/* <NavLink to={"/about"} className="nav-link px-md-4">
            Về chúng tôi
          </NavLink>
          <NavLink to={"/events"} className="nav-link px-md-4">
            Sự kiện
          </NavLink> */}
          <NavLink to={"/feedbacks/1"} className="nav-link px-md-4">
            Feedback
          </NavLink>
        </Nav>
        <Nav className="align-items-md-center">
          <Link
            to={"/cart"}
            className="me-4 my-3 position-relative d-none d-md-inline"
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-baca fs-4" />
            <Badge
              bg="white"
              className="border border-black position-absolute translate-middle"
            >
              <span className="text-baca">{cartItemCount}</span>
            </Badge>
          </Link>
          <Link to={"/"} className="text-white btn bg-baca">
            Đăng nhập
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
