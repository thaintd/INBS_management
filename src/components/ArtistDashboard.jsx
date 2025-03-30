import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import StoreManagement from "./StoreManagement";
import ArtistManagement from "./ArtistManagement";
import DesignManagement from "./DesignManagement";
import ServiceManagement from "./ServiceManagement";
import BookingManagement from "./BookingManagement";
import axiosInstance from "../services/axiosConfig";

const ArtistDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

const handleDeviceToken = async () => {
    const formData = new FormData()

                formData.append(`deviceToken`, localStorage.getItem("deviceToken"))

            await axiosInstance.post("/api/DeviceToken", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
}

    const handleLogout = async () => {
        try {
            await handleDeviceToken()
            localStorage.clear();
            toast.success('Đăng xuất thành công!', {
                position: "top-right",
                autoClose: 1000,
                onClose: () => {
                    navigate('/login');
                }
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đăng xuất!');
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const code = queryParams.get('code');

        if (status && code) {
            if (status === 'PAID' && code === '00') {
                toast.success('Thanh toán thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                let errorMessage = 'Thanh toán thất bại!';
                if (status === 'CANCELLED') {
                    errorMessage = 'Giao dịch đã bị hủy!';
                }
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    }, [location]);

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Nail Management
                    </a>
                    
                    <div className="d-flex align-items-center">
                        <div className="dropdown me-3">
                        <button 
                                        className="text-danger" 
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Đăng xuất
                                    </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid mt-4">
                <ToastContainer />
                <BookingManagement />
            </div>
        </div>
    );
};

export default ArtistDashboard;
