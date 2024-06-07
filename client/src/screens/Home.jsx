import React, { useCallback, useEffect, useState } from "react";
import thumbnail from "../assets/thumbnail.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import {
  capitalizeString,
  numberWithDots,
  pushAndReturnCopy,
  removeByValue,
} from "../ultis/ReusedFunc";
import debounce from "lodash.debounce";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);
    (async () => {
      try {
        setLoading(true);
        const resCategories = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/api/category"
        );
        const resItems = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/items"
        );

        setItems(resItems.data.data);
        setCategories(resCategories.data.data);
        setLoading(false);
        clearInterval(counterInterval);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => clearInterval(counterInterval);
  }, []);

  useEffect(() => {
    if (!loading && counter !== 0) {
      console.log("Final Counter:", counter);
      setCounter(0);
    }
  }, [loading, counter]);

  const addItem = useCallback(
    (item) => {
      const existIdIndex = cart.findIndex((i) => i._id === item._id);
      const newCart = [...cart];
      if (existIdIndex > -1) {
        newCart[existIdIndex] = {
          _id: item._id,
          quantity: newCart[existIdIndex].quantity + 1,
        };
        toast(`+1 ${item.name}`, {
          className: "bg-success text-white text-center",
        });
      } else {
        newCart.push({ _id: item._id, quantity: 1 });
        toast(`Đã thêm ${item.name} vào giỏ hàng`, {
          className: "bg-success text-white text-center",
        });
      }
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    },
    [cart]
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    categories: [],
  });
  const fetchSearch = useCallback(
    async (search) => {
      console.log(search);
      try {
        setLoading(true);
        const res = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/items",
          {
            name: search,
            categories: filter.categories,
          }
        );
        console.log(res);
        setItems(res.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [filter]
  );

  const debounceOnChange = useCallback(
    debounce((value) => {
      console.log(value);
      fetchSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      debounceOnChange(newSearch);
    },
    [debounceOnChange]
  );

  return (
    <>
      <MainLayout>
        <Row>
          <Col>
            <Link to={"/about"} className="d-block">
              <img
                src={thumbnail}
                className="w-100 object-fit-cover"
                alt="thumbnail"
              />
            </Link>
          </Col>
        </Row>
        <Row className="px-2 px-md-3 px-lg-5 pb-4">
          <h2 className="text-center mb-3 pt-4 fs-1">Menu</h2>
          <div className="d-flex mb-5">
            <div
              className="p-3 d-flex align-items-center flex-grow-1 border border-dark-subtle overflow-hidden"
              style={{ borderRadius: "10px" }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
              <input
                value={search}
                onChange={handleSearchChange}
                type="text"
                className="border-0 d-inline w-auto custom-input h-100 flex-grow-1"
              />
            </div>
            <Button
              className="ms-2 bg-transparent border-baca filter-btn"
              style={{ aspectRatio: "1/1" }}
              onClick={handleShow}
            >
              <FontAwesomeIcon
                icon={faSliders}
                className="text-baca filter-icon"
              />
            </Button>
          </div>

          {loading ? (
            <div>
              <h1>Loading...</h1>
              <p>Time Elapsed: {counter} seconds</p>
            </div>
          ) : (
            items.map((item, i) => (
              <Col key={i} lg={3} md={4} xs={6} className="baca-item mb-2">
                <Card border="0" className="h-100">
                  <div className="item-img-container">
                    <Card.Img
                      loading="lazy"
                      className="w-100 h-100"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      variant="top"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title>{capitalizeString(item.name)}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button
                        className="bg-transparent border-0 p-0"
                        onClick={() => addItem(item)}
                      >
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="text-baca fs-4"
                        />
                      </Button>
                      <span className="text-baca fw-bold">
                        {numberWithDots(item.price)}đ/{item.unit}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </MainLayout>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Menu Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {categories.map((c) => (
              <Form.Check
                key={c._id}
                label={c.name}
                type="checkbox"
                value={c._id}
                checked={filter.categories.includes(c._id)}
                onChange={() => {
                  setFilter((pre) => ({
                    ...pre,
                    categories: pre.categories.includes(c._id)
                      ? [...removeByValue(pre.categories, c._id)]
                      : [...pushAndReturnCopy(filter.categories, c._id)],
                  }));
                }}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="bg-baca border-0"
            onClick={() => fetchSearch(search)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
