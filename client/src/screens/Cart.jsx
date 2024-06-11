import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Table from "react-bootstrap/Table";
import { Button, Form } from "react-bootstrap";
import {
  calculateCartSum,
  numberWithDots,
  validatePhoneNumber,
} from "../ultis/ReusedFunc";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMinus,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    phoneNumber: "",
    address: "",
    receiver: "",
    note: "",
  });

  useEffect(() => {
    (async () => {
      try {
        await axios.post(process.env.REACT_APP_BOT_URL + "/send-notification");
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const items = [];
        savedCart.forEach((item) => {
          items.push(item._id);
        });
        const resCart = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/items/getItemsById",
          {
            items,
          }
        );
        setCart(
          [...resCart.data.data].map((item) => {
            const { quantity } = savedCart.find(
              (saveItem) => saveItem._id === item._id
            );
            return { ...item, quantity };
          })
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    })();
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [orderPrice, setOrderPrice] = useState(0);
  useEffect(() => {
    let sum = calculateCartSum(cart);
    console.log(sum);
    if (sum >= 90000) {
      sum *= 0.9;
    }
    setOrderPrice(sum);
  }, [cart]);
  const saveToLocal = useCallback((cart) => {
    setCart(cart);
    localStorage.setItem(
      "cart",
      JSON.stringify(
        cart.map((item) => ({ _id: item._id, quantity: item.quantity }))
      )
    );
  }, []);

  const handleDelete = useCallback(
    (index) => {
      if (window.confirm(`Do you want to delete ${cart[index].name}`)) {
        const copiedCart = [...cart];
        copiedCart.splice(index, 1);
        saveToLocal(copiedCart);
      } else return;
    },
    [cart, saveToLocal]
  );

  const increaseQuantity = useCallback(
    (index) => {
      const copiedCart = [...cart];
      copiedCart[index] = {
        ...copiedCart[index],
        quantity: copiedCart[index].quantity + 1,
      };
      saveToLocal(copiedCart);
    },
    [cart, saveToLocal]
  );

  const decreaseQuantity = useCallback(
    (index) => {
      if (cart[index].quantity === 1) {
        handleDelete(index);
      } else {
        const copiedCart = [...cart];
        copiedCart[index] = {
          ...copiedCart[index],
          quantity: copiedCart[index].quantity - 1,
        };
        saveToLocal(copiedCart);
      }
    },
    [cart, handleDelete, saveToLocal]
  );

  const navigate = useNavigate();
  const handleSumbit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        for (const key in customer) {
          if (customer[key].trim() === "") {
            throw Error("Vui lòng nhập đủ thông tin người nhận");
          }
        }

        if (!validatePhoneNumber(customer.phoneNumber)) {
          throw Error("Số điện thoại sai định dạng");
        }

        const res = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/order",
          {
            phoneNumber: customer.phoneNumber,
            address: customer.address,
            items: cart.map((item) => ({
              item: item._id,
              amount: item.quantity,
            })),
            receiver: customer.receiver,
            total: orderPrice,
            note: customer.note,
          }
        );
        toast.success(res.data.message);
        localStorage.setItem("cart", "[]");
        navigate("/");
      } catch (error) {
        toast(error.message, {
          className: "bg-danger text-white",
        });
      }
    },
    [cart, customer, navigate]
  );

  return (
    <>
      <MainLayout>
        <h2 className="text-baca pt-5 ps-5">
          <FontAwesomeIcon icon={faCartShopping} />
          <span>Giỏ Hàng</span>
        </h2>
        <h4 className="text-center fs-6" style={{ color: "red" }}>
          Giảm 10% với đơn hàng trên 90k
        </h4>
        <div className="d-flex justify-content-center mt-3">
          <Table
            bordered
            className="w-75 cart-table overflow-hidden"
            hover
            style={{ minWidth: "300px" }}
          >
            <tbody>
              {loading ? (
                <tr>
                  <td>
                    <h1>Loading</h1>
                  </td>
                </tr>
              ) : (
                cart.map((i, index) => (
                  <tr
                    key={i._id}
                    className="cart-item"
                    style={{ position: "relative" }}
                  >
                    <td>
                      <div
                        className="item-img-container d-inline-block border-black me-2"
                        style={{ width: "80px" }}
                      >
                        <img
                          src={i.image}
                          alt={i.name}
                          className="h-100 w-100"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </td>
                    <td className="position-relative">
                      <div
                        className="mt-2 me-2 position-absolute bg-transparent d-flex cursor-pointer"
                        style={{ top: "0", right: "0" }}
                      >
                        <FontAwesomeIcon
                          icon={faX}
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                      <div
                        className="mb-2 me-2 position-absolute bg-transparent d-flex"
                        style={{ bottom: "0", right: "0" }}
                      >
                        <div className="bg-white d-flex justify-content-center align-items-center p-1 rounded-circle border-baca cursor-pointer">
                          <FontAwesomeIcon
                            icon={faMinus}
                            onClick={() => decreaseQuantity(index)}
                          />
                        </div>
                        <span className="mx-2">
                          {i.quantity} {i.unit}
                        </span>
                        <div className="bg-baca d-flex justify-content-center align-items-center p-1 rounded-circle cursor-pointer">
                          <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => increaseQuantity(index)}
                          />
                        </div>
                      </div>
                      <div className="me-4">
                        <strong>{i.name}</strong>
                      </div>
                      <div className="mt-2">
                        <strong className="text-danger">
                          {numberWithDots(i.price * i.quantity)}đ
                        </strong>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              <tr className="last-row">
                <td
                  colSpan={99}
                  style={{ fontSize: "smaller", border: "1px solid black" }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="d-flex">
                      Tổng tiền:
                      {calculateCartSum(cart) >= 90000 ? (
                        <div>
                          <span className="text-secondary text-decoration-line-through fw-bold ms-1">
                            {numberWithDots(calculateCartSum(cart))}đ
                          </span>
                          <span className="text-danger fw-bold ms-1">
                            {numberWithDots(orderPrice)}đ
                          </span>{" "}
                        </div>
                      ) : (
                        <span className="text-danger fw-bold ms-1">
                          {numberWithDots(orderPrice)}đ
                        </span>
                      )}
                    </span>
                    <Button size="sm" className="bg-baca border-0 me-lg-4 ms-2">
                      <span
                        className="text-dark"
                        onClick={() => {
                          cart.length === 0 ? navigate("/") : handleShow();
                        }}
                      >
                        Đặt hàng
                      </span>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </MainLayout>
      <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={handleSumbit}>
          <Modal.Header closeButton>
            <Modal.Title>Thông tin thanh toán</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                required
                type="text"
                value={customer.phoneNumber}
                onChange={(e) =>
                  setCustomer((pre) => ({
                    ...pre,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                required
                type="text"
                value={customer.location}
                onChange={(e) =>
                  setCustomer((pre) => ({
                    ...pre,
                    address: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tên người nhận</Form.Label>
              <Form.Control
                required
                type="text"
                value={customer.receiver}
                onChange={(e) =>
                  setCustomer((pre) => ({
                    ...pre,
                    receiver: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                type="text"
                value={customer.note}
                onChange={(e) =>
                  setCustomer((pre) => ({
                    ...pre,
                    note: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button className="bg-baca border-0" type="submit">
              Xác nhận đặt hàng
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
