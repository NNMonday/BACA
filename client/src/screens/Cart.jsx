import React from "react";
import MainLayout from "../layouts/MainLayout";
import Table from "react-bootstrap/Table";

export default function Cart() {
  return (
    <MainLayout>
      <h2 className="text-baca pt-5 ps-5">
        <i className="fa-solid fa-cart-shopping fs-3 me-3"></i>
        <span>Giỏ Hàng</span>
      </h2>
      <div className="d-flex justify-content-center mt-3">
        <Table
          className="w-75 cart-table"
          hover
          style={{ backgroundColor: "#FEF6F3" }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th></th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </MainLayout>
  );
}
