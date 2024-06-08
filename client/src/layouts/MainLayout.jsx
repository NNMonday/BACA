import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import MyNav from "../components/MyNav";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  useEffect(() => {
    const height = document.querySelector(".main-navbar").offsetHeight;
    setNavbarHeight(height);
  }, []);
  return (
    <Container fluid className="p-0">
      <MyNav />
      <div style={{ marginTop: navbarHeight + "px", minHeight: "100vh" }}>{children}</div>
      <Footer />
    </Container>
  );
}
