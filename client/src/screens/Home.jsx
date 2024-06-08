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
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const updateCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }, []);
  const handleCartClick = (item) => {
    const temp = { data: item, quantity: 1 };
    setSelectedItem(temp);
    setShowModal(true);
  };
  useEffect(() => {
    if (!loading && counter !== 0) {
      console.log("Final Counter:", counter);
      setCounter(0);
    }
  }, [loading, counter]);

  const addItem = useCallback(
    (item, quantity) => {
      console.log(selectedItem);
      const existIdIndex = cart.findIndex((i) => i._id === item._id);
      const newCart = [...cart];
      if (existIdIndex > -1) {
        newCart[existIdIndex] = {
          _id: item._id,
          quantity: newCart[existIdIndex].quantity + quantity,
        };
        toast(`+1 ${item.name}`, {
          className: "bg-success text-white text-center",
        });
      } else {
        newCart.push({ _id: item._id, quantity: quantity });
        updateCart(newCart);
      }
      setShowModal(false);
      toast.success("Đã thêm vào giỏ hàng");
    },
    [cart, selectedItem, updateCart]
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    categories: [],
  });
  const fetchSearch = useCallback(
    async (search) => {
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
                className="w-100 h-100 object-fit-cover"
                alt="thumbnail"
                width={878}
                height={325}
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
              <Form>
                <Form.Group controlId="search">
                  <Form.Label className="d-none">Search</Form.Label>
                  <input
                    value={search}
                    onChange={handleSearchChange}
                    type="text"
                    className="border-0 d-inline w-auto custom-input h-100 flex-grow-1"
                  />
                </Form.Group>
              </Form>
            </div>
            <Button
              className="ms-2 bg-transparent border-baca filter-btn"
              style={{ aspectRatio: "1/1" }}
              onClick={handleShow}
              aria-label="Filter"
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
                        onClick={() => handleCartClick(item)}
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
          <Modal.Title>Bộ lọc menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categories">
              <Form.Label>Loại đồ ăn:</Form.Label>
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
            </Form.Group>
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
      <Modal
        show={showModal}
        onHide={(e) => {
          setShowModal(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm vào giỏ hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div className="bg-bg-black col-6 d-flex align-items-center">
              <img
                src={selectedItem?.data.image}
                className="w-25 object-fit-cover rounded-2 shadow-lg me-2"
                style={{ aspectRatio: "1/1", objectPosition: "center" }}
                alt="Item"
              />
              <div>
                <h4 className="fs-6 fw-normal mb-0">
                  {selectedItem?.data.name}
                </h4>
                <p className="fs-6 mb-0" style={{ color: "#717171" }}>
                  {selectedItem
                    ? numberWithDots(selectedItem?.data.price)
                    : "0"}{" "}
                  đ/ {selectedItem?.data.unit}
                </p>
              </div>
            </div>
            <div
              className="col-6 d-flex"
              style={{ justifyContent: "end", alignItems: "center" }}
            >
              <FontAwesomeIcon
                className="fa fa-solid fa-plus rounded-1"
                icon={faPlus}
                style={{ backgroundColor: "#dcc295", padding: "4px" }}
                onClick={(e) => {
                  const updatedItem = {
                    ...selectedItem,
                    quantity: selectedItem.quantity + 1,
                  };
                  setSelectedItem(updatedItem);
                }}
              />
              <input
                className="w-25 mx-2 rounded-1"
                type="number"
                value={selectedItem?.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  if (
                    typeof quantity === "number" &&
                    quantity > 0 &&
                    Number.isInteger(quantity)
                  ) {
                    setSelectedItem((pre) => ({
                      ...pre,
                      quantity: e.target.value,
                    }));
                  } else {
                    toast.error("Chỉ chấp nhận số lớn hơn 0");
                  }
                }}
              />
              <FontAwesomeIcon
                icon={faMinus}
                className="fa fa-solid fa-minus rounded-1"
                style={{ backgroundColor: "#dcc295", padding: "4px" }}
                onClick={(e) => {
                  const updatedItem = {
                    ...selectedItem,
                    quantity: selectedItem.quantity - 1,
                  };
                  setSelectedItem(updatedItem);
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-baca border-0"
            onClick={(e) => {
              addItem(selectedItem.data, selectedItem.quantity);
            }}
          >
            Thêm vào giỏ hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
