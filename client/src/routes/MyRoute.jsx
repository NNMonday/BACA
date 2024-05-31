import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import About from "../screens/About";
import Events from "../screens/Events";
import Cart from "../screens/Cart";
import Feedbacks from "../screens/Feedbacks";
import AdminLogin from "../screens/AdminLogin";
import Order from "../screens/Order";

export default function MyRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/feedbacks/:page" element={<Feedbacks />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}
