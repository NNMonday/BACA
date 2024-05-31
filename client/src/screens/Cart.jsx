import React, { useEffect, useState } from "react";
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

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    phoneNumber: "",
    address: "",
    receiver: "",
  });
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const saveToLocal = (cart) => {
    setCart(cart);
    localStorage.setItem(
      "cart",
      JSON.stringify(
        cart.map((item) => ({ _id: item._id, quantity: item.quantity }))
      )
    );
  };

  const handleDelete = (index) => {
    if (window.confirm(`Do you want to delete ${cart[index].name}`)) {
      const copiedCart = [...cart];
      copiedCart.splice(index, 1);
      saveToLocal(copiedCart);
    } else return;
  };

  const increaseQuantity = (index) => {
    const copiedCart = [...cart];
    copiedCart[index] = {
      ...copiedCart[index],
      quantity: copiedCart[index].quantity + 1,
    };
    saveToLocal(copiedCart);
  };

  const decreaseQuantity = (index) => {
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
  };

  const navigate = useNavigate();
  const handleSumbit = async (e) => {
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
          address: customer.location,
          items: cart.map((item) => ({
            item: item._id,
            amount: item.quantity,
          })),
          receiver: customer.name,
        }
      );
      toast(res.data.message, {
        className: "bg-success text-white",
      });
      localStorage.setItem("cart", "[]");
      navigate("/");
    } catch (error) {
      toast(error.message, {
        className: "bg-danger text-white",
      });
    }
  };

  return (
    <>
      <MainLayout>
        <h2 className="text-baca pt-5 ps-5">
          <i className="fa-solid fa-cart-shopping fs-3 me-3"></i>
          <span>Giỏ Hàng</span>
        </h2>
        <div className="d-flex justify-content-center mt-3">
          <Table bordered className="w-75 cart-table overflow-hidden" hover>
            <tbody>
              {cart.map((i, index) => (
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
                      <img src={i.image} alt={i.name} className="h-100 w-100" />
                    </div>
                  </td>
                  <td>
                    <div
                      className="mt-2 me-2 position-absolute bg-transparent d-flex"
                      style={{ top: "0", right: "0" }}
                    >
                      <i
                        className="fa-solid fa-x"
                        onClick={() => handleDelete(index)}
                      ></i>
                    </div>
                    <div
                      className="mb-2 me-2 position-absolute bg-transparent d-flex"
                      style={{ bottom: "0", right: "0" }}
                    >
                      <div className="bg-white d-flex justify-content-center align-items-center p-1 rounded-circle border-baca">
                        <i
                          className="fa-solid fa-minus"
                          onClick={() => decreaseQuantity(index)}
                        ></i>
                      </div>
                      <span className="mx-2">
                        {i.quantity} {i.unit}
                      </span>
                      <div className="bg-baca d-flex justify-content-center align-items-center p-1 rounded-circle">
                        <i
                          className="fa-solid fa-plus"
                          onClick={() => increaseQuantity(index)}
                        ></i>
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
              ))}

              <tr className="last-row">
                <td
                  colSpan={99}
                  style={{ fontSize: "smaller", border: "1px solid black" }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span>
                      Tổng tiền:
                      <span className="text-danger fw-bold ms-1">
                        {numberWithDots(calculateCartSum(cart))}đ
                      </span>
                    </span>
                    <Button size="sm" className="bg-baca border-0 me-lg-4 ms-2">
                      <span
                        className="text-dark"
                        onClick={() => {
                          cart.length === 0 ? navigate("/") : handleShow();
                        }}
                      >
                        Thanh toán
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
