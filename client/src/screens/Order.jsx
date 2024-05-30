import { Button, Pagination, Table } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
export default function Order() {
  const [orderList, setOrderList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
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
      process.env.REACT_APP_BACKEND_URL  + `/api/order/delete/${orderId}`
    );
    if (result.status === 200) {
      toast.success(result.data.message);
      const newOrderList = orderList.filter((order) => order._id !== orderId);
      setOrderList(newOrderList);
    } else {
      toast.error(result.data.message);
    }
  };
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
                    <span key={index}>
                      {item.amount} {item.item.name}
                      <br />
                    </span>
                  ))}
                </td>
                <td>
                  {" "}
                  {formatCurrency(
                    o.items.reduce(
                      (total, item) => total + item.amount * item.item.price,
                      0
                    )
                  )}
                </td>
                <td>{<input type="checkbox" checked={o.confirmed}></input>}</td>
                <td>{<input type="checkbox" checked={o.shipped}></input>}</td>
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
                      <Button>Cập nhật</Button>
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
