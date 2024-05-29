import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function MyNav() {
  return (
    <Navbar
      expand="md"
      className="bg-white fixed-top shadow px-4 justify-content-between main-navbar"
    >
      <Navbar.Brand>
        <Link to={"/"} className="d-inline-block">
          <img src={logo} alt="Logo" />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="my-nav" />
      <Navbar.Collapse id="my-nav" className="fs-5">
        <Nav className="flex-grow-1 justify-content-center">
          <NavLink to={"/"} className="nav-link px-md-4">
            Trang chủ
          </NavLink>
          <NavLink to={"/about"} className="nav-link px-md-4">
            Về chúng tôi
          </NavLink>
          <NavLink to={"/events"} className="nav-link px-md-4">
            Sự kiện
          </NavLink>
          <a
            href="https://forms.gle/9REpzcme1zMqq7M29"
            target="_blank"
            rel="noreferrer"
            className="nav-link px-md-4"
          >
            Feedback
          </a>
        </Nav>
        <Nav className="align-items-md-center">
          <Link to={"/cart"} className="me-3 my-3">
            <i className="fa-solid fa-cart-shopping text-baca fs-4"></i>
          </Link>
          <Link to={"/"} className="text-white btn bg-baca">
            Đăng nhập
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
