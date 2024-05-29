import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import MyNav from "../components/MyNav";

export default function MainLayout({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(0);

  const handleResize = useCallback(() => {
    const height = document.querySelector(".main-navbar").offsetHeight;
    setNavbarHeight(height);
  }, []);

  useEffect(() => {
    handleResize();
  }, [handleResize]);
  return (
    <Container fluid className="p-0">
      <MyNav />
      <div style={{ marginTop: navbarHeight + "px" }}>{children}</div>
      <div style={{ height: "1000px" }}></div>
    </Container>
  );
}
