import { Button, Form, FormControl } from "react-bootstrap";
import logoImg from "../assets/logo + avt.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: "#FFF7EB", width: "100%", height: "100vh" }}>
      <img
        src={logoImg}
        style={{ width: "400px", position: "relative", left: "580px" }}
      />
      <h6 style={{ textAlign: "center" }}>Trang quản lý đơn hàng</h6>
      <Form style={{ width: "30%", margin: "10px auto" }}>
        <FormControl
          required
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          type="password"
          placeholder="nhập mật khẩu"
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (password === "12345") {
              navigate("/order");
            } else {
              toast.error("Mật khẩu không đúng");
            }
          }}
          style={{ marginLeft: "170px", marginTop: "10px" }}
        >
          Login admin
        </Button>
      </Form>
    </div>
  );
}
