import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import About from "../screens/About";
import Events from "../screens/Events";
import Cart from "../screens/Cart";
import Feedbacks from "../screens/Feedbacks";

export default function MyRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
      </Routes>
    </BrowserRouter>
  );
}
