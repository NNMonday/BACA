import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import thumbnail from "../assets/thumbnail.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { capitalizeString, numberWithDots } from "../ultis/ReusedFunc";

export default function Home() {
  const thumbnailRatio = useMemo(() => 531 / 1440, []);
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const headlineRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const thumbnailImgRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/api/items"
        );
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (headlineRef.current && thumbnailContainerRef.current) {
        const newHeight = headlineRef.current.offsetHeight + 30;
        const contanerWidthLongerThanImgWidth =
          window.innerWidth > newHeight / thumbnailRatio;
        thumbnailContainerRef.current.style.height =
          contanerWidthLongerThanImgWidth ? "auto" : `calc(${newHeight}px)`;
        thumbnailImgRef.current.classList = contanerWidthLongerThanImgWidth
          ? "w-100"
          : "h-100";
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [headlineRef, thumbnailContainerRef]);

  const addItem = useCallback((id) => {}, []);

  return (
    <MainLayout>
      <Row>
        <Col>
          <div
            className="pt-5 ps-5 position-absolute headline"
            ref={headlineRef}
          >
            <h1 className="text-baca" style={{ fontSize: "5vw" }}>
              BACA
            </h1>
            <h1 className="mb-4" style={{ fontSize: "5vw" }}>
              Bánh Cá Ngũ Vị
            </h1>
            <p className="d-none d-md-block" style={{ width: "35%" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              molestie libero eros, ut bibendum arcu dapibus nec. Integer nisi
              neque, convallis ut tortor eget, aliquet interdum purus.
            </p>
            <Link to={"/about"} className="btn bg-baca text-white mt-md-3">
              Tìm hiểu thêm
            </Link>
          </div>
          <div
            className="thumbnail-container"
            ref={thumbnailContainerRef}
            style={{ minHeight: "200px" }}
          >
            <img src={thumbnail} alt="thumbnail" ref={thumbnailImgRef} />
          </div>
        </Col>
      </Row>
      <Row className="px-5">
        <h2 className="text-decoration-underline text-center mb-3 py-4 fs-1">
          Menu
        </h2>
        {data.map((item, i) => (
          <Col key={i} lg={3} md={4} sm={6} className="baca-item">
            <Card border="0">
              <div className="item-img-container">
                <Card.Img
                  className="w-100 h-100"
                  variant="top"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <Card.Body>
                <Card.Title>{capitalizeString(item.name)}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <i className="fa-solid fa-cart-shopping text-baca fs-4"></i>
                  <span className="text-baca fw-bold">
                    {numberWithDots(item.price)}đ/{item.unit}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </MainLayout>
  );
}
