import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import StoreManagement from "./StoreManagement";
import ArtistManagement from "./ArtistManagement";
import DesignManagement from "./DesignManagement";
import ServiceManagement from "./ServiceManagement";
import BookingManagement from "./BookingManagement";

const ArtistDashboard = () => {
    const location = useLocation();

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
        <>
            <ToastContainer />
            <BookingManagement />
        </>
    );
};

export default ArtistDashboard;
