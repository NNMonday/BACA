import { Button, Pagination, Table } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
export default function Order() {
  const [orderList, setOrderList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const resItems = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/items"
        );

        setItems(resItems.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const SERVER_URL = "https://baca.onrender.com";
  useEffect(() => {
    const fetchOrder = async () => {
      const result = await axios.get(
        SERVER_URL + `/api/order/list?index=${pageIndex}&pageSize=${pageSize}`
      );
      if (result.status === 200) {
        console.log(result.data.data);
        setTotalPages(result.data.totalPages);
        setOrderList(result.data.data);
      } else {
        toast.error(result.data.message);
      }
    };
    fetchOrder();
  }, [pageIndex, pageSize]);
  const formatCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };
  const deleteOrder = async (orderId) => {
    const result = await axios.delete(
      process.env.REACT_APP_BACKEND_URL + `/api/order/delete/${orderId}`
    );
    if (result.status === 200) {
      toast.success(result.data.message);
      const newOrderList = orderList.filter((order) => order._id !== orderId);
      setOrderList(newOrderList);
    } else {
      toast.error(result.data.message);
    }
  };
  const handleCheckBoxChange = (e, type, id) => {
    const updatedOrders = orderList.map((order) => {
      if (order._id === id) {
        return { ...order, [type]: e.target.checked };
      }
      return order;
    });
    setOrderList(updatedOrders);
  };
  const updateOrder = async (id, confirmed, shipped) => {
    const result = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/order/update/${id}`,
      {
        confirmed: confirmed,
        shipped: shipped,
      }
    );

    if (result.status === 200) {
      toast.success(result.data.message);
      window.location.reload();
    } else {
      toast.error(result.data.message);
    }
  };
  const handleDeleteItem = (id, itemId) => {
    const updatedOrders = orderList.map((order) => {
      if (order._id === id) {
        const updatedItems = order.items.filter((item) => item.item !== itemId);
        return { ...order, items: updatedItems };
      }
      return order;
    });
    setOrderList(updatedOrders);
  };
  // const addItem = (e, orderId) =>{
  //   const amount = parseInt(document.getElementById(`amount${orderId}`).value);
  //   const itemId = document.getElementById(`item${orderId}`).value; 
  // }
  return (
    <MainLayout>
      <h2 className="text-baca pt-5 ps-5">
        <i className="fa-solid fa-cart-shopping fs-3 me-3"></i>
        <span>Đơn Hàng</span>
      </h2>
      <div>
        <Table
          striped
          bordered
          hover
          style={{ margin: "10px auto", width: "95%" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Tên người nhận</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Đơn hàng</th>
              <th>Tổng giá</th>
              <th>Note</th>
              <th>Đã gọi</th>
              <th>Đã ship</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((o, i) => (
              <tr key={o._id}>
                <td>{i + 1}</td>
                <td>{o.receiver}</td>
                <td>{o.phoneNumber}</td>
                <td>{o.address}</td>
                <td>
                  {o.items.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center w-100"
                    >
                      <span>
                        {" "}
                        {item.amount} {item.item.name}
                      </span>
                      <TiDelete
                        onClick={(e) => {
                          handleDeleteItem(o._id, item.item);
                        }}
                      />
                    </div>
                  ))}
                  <br/>
                  <div>
                    -Thêm sản phẩm-
                    <div className="w-100">
                      <div>
                        số lượng
                        <input type="number" id={`amount${o._id}`}/>
                      </div>
                      <div>
                        sản phẩm
                        <select id={`item`}>
                          {items.map((i) => (
                            <option value={i._id} id={`item${o._id}`}>{i.name}</option>
                          ))}
                        </select>
                      </div>
                      <button>add</button>
                    </div>
                  </div>
                </td>
                <td> {formatCurrency(o.total)}</td>
                <td>{o.note}</td>
                <td>
                  {
                    <input
                      type="checkbox"
                      checked={o.confirmed}
                      value={o.confirmed}
                      onChange={(e) => {
                        handleCheckBoxChange(e, "confirmed", o._id);
                      }}
                    ></input>
                  }
                </td>
                <td>
                  {
                    <input
                      type="checkbox"
                      checked={o.shipped}
                      value={o.confirmed}
                      onChange={(e) => {
                        handleCheckBoxChange(e, "shipped", o._id);
                      }}
                    ></input>
                  }
                </td>
                <td>
                  {
                    <div>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          deleteOrder(o._id);
                        }}
                      >
                        Huỷ đơn
                      </Button>
                      <Button
                        onClick={(e) => {
                          updateOrder(o._id, o.confirmed, o.shipped);
                        }}
                      >
                        Cập nhật
                      </Button>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          className="d-flex justify-content-between"
          style={{ padding: "30px" }}
        >
          <Pagination>
            <Pagination.First
              onClick={() => {
                setPageIndex(0);
              }}
            />
            <Pagination.Prev
              onClick={() => {
                if (pageIndex > 0) {
                  setPageIndex(pageIndex - 1);
                }
              }}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index === pageIndex}
                onClick={() => setPageIndex(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => {
                if (pageIndex < totalPages - 1) {
                  setPageIndex(pageIndex + 1);
                }
              }}
            />
            <Pagination.Last
              onClick={() => {
                setPageIndex(totalPages - 1);
              }}
            />
          </Pagination>
          <div>
            <p>
              hiển thị{" "}
              <input
                type="number"
                style={{ width: "40px" }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.currentTarget.value);
                  setPageIndex(0);
                }}
              />
              đơn hàng
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
