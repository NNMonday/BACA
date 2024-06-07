import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("../screens/Home"));
const About = lazy(() => import("../screens/About"));
const Events = lazy(() => import("../screens/Events"));
const Cart = lazy(() => import("../screens/Cart"));
const Feedbacks = lazy(() => import("../screens/Feedbacks"));
const AdminLogin = lazy(() => import("../screens/AdminLogin"));
const Order = lazy(() => import("../screens/Order"));

export default function MyRoute() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/feedbacks/:page" element={<Feedbacks />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
