import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingManagement from "./BookingManagement";
import axiosInstance from "../services/axiosConfig";
import { Container, Nav, Navbar, Button } from "react-bootstrap"; // Thêm Navbar và Button
import "bootstrap/dist/css/bootstrap.min.css"; // Import CSS Bootstrap

const ArtistDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDeviceToken = async () => {
    const formData = new FormData();
    formData.append("deviceToken", localStorage.getItem("deviceToken"));

    const accessToken = localStorage.getItem("token")
    const response = await axiosInstance.post("/api/DeviceToken", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
  };

  const handleLogout = async () => {
    try {
      await handleDeviceToken();
      localStorage.clear();
      toast.success("Đăng xuất thành công!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/login"),
      });
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const code = queryParams.get("code");

    if (status && code) {
      if (status === "PAID" && code === "00") {
        toast.success("Thanh toán thành công!", { position: "top-right", autoClose: 3000 });
      } else {
        const errorMessage = status === "CANCELLED" ? "Giao dịch đã bị hủy!" : "Thanh toán thất bại!";
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      }
    }
  }, [location]);

  return (
    <div>
      {/* Navbar sử dụng React Bootstrap chuẩn */}
      <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/profile">Thông tin cá nhân</Nav.Link>
              <Nav.Link href="/artist">Danh sách cuộc hẹn</Nav.Link>
            </Nav>
            <Button variant="link" className="text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Đăng xuất
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <ToastContainer />
        <BookingManagement />
      </Container>
    </div>
  );
};

export default ArtistDashboard;