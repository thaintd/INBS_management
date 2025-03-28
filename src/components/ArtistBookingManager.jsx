import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";

const ArtistBookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [expandedBookingId, setExpandedBookingId] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({});
    const [pageSize, setPageSize] = useState(5);
    
    const [isLoading, setIsLoading] = useState(false);

    const fetchBasicCustomerInfo = async (customerSelectedID) => {
        const response = await axiosInstance.get(
            `/odata/customerSelected?$filter=id eq ${customerSelectedID}&$select=id,customerID&$expand=customer($select=id,description;$expand=user($select=id,fullname))`
        );
        return response.value?.[0];
    };

    const fetchCustomerSelected = async (customerSelectedID) => {
        const response = await axiosInstance.get(
            `/odata/customerSelected?$filter=id eq ${customerSelectedID}&$select=id,isFavorite,customerID&$expand=customer($select=id,description;$expand=user($select=id,fullname,phoneNumber,imageUrl))`
        );

        const customerSelected = response.value?.[0];
        if (!customerSelected) return null;

        const nailDesignServiceSelecteds = await fetchNailDesignServiceSelecteds(customerSelectedID);
        customerSelected.NailDesignServiceSelecteds = nailDesignServiceSelecteds;

        return customerSelected;
    };

    const fetchNailDesignServiceSelecteds = async (customerSelectedId) => {
        const response = await axiosInstance.get(
            `/odata/nailDesignServiceSelected?$filter=customerSelectedId eq ${customerSelectedId}&$select=duration,nailDesignServiceId`
        );
        const nailDesignServiceSelecteds = response.value ?? [];

        const nailDesignServicePromises = nailDesignServiceSelecteds.map(async (c) => {
            c.NailDesignService = await fetchNailDesignService(c.NailDesignServiceId);
            return c;
        });

        return await Promise.all(nailDesignServicePromises);
    };

    const fetchNailDesignService = async (nailDesignServiceId) => {
        const response = await axiosInstance.get(
            `/odata/nailDesignService?$filter=id eq ${nailDesignServiceId}&$select=id,nailDesignId,serviceId,extraPrice&$expand=nailDesign($select=id,isLeft,nailPosition;$expand=design($select=id,name,trendScore,description,averagerating))`
        );
        const nailDesignService = response.value?.[0];
        if (!nailDesignService) return null;

        const service = await fetchService(nailDesignService.ServiceId);
        nailDesignService.Service = service;
        return nailDesignService;
    };

    const fetchService = async (serviceId) => {
        const response = await axiosInstance.get(
            `/odata/service?$filter=id eq ${serviceId}&$select=id,name,price&$expand=servicePriceHistories($select=id,price,effectiveFrom,effectiveTo)`
        );
        return response.value?.[0];
    };

    const fetchArtistStore = async (artistStoreId) => {
        const response = await axiosInstance.get(
            `/odata/artistStore?$filter=id eq ${artistStoreId}&$select=id,workingDate,startTime,endTime,storeId,artistId&$expand=store($select=id,imageUrl,description,address),artist($select=id,yearsOfExperience,level;$expand=user($select=id,email,fullname))`
        );
        return response.value?.[0];
    };

    const getId = () =>{
        var token = localStorage.getItem("token")
        const decodedToken = jwtDecode(token)
        return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            try {
                const skip = currentPage * pageSize;
                const artistId = getId()
                const response = await axiosInstance.get(
                    `/odata/booking?$filter=artistStore/artistId eq ${artistId}&count=true&$top=${pageSize}&$skip=${skip}&$select=id,createdAt,lastModifiedAt,status,startTime,serviceDate,predictEndTime,totalAmount,customerSelectedId,artistStoreId`
                );
                
                const totalCount = response["@odata.count"] ?? 0;
                setTotalPages(Math.ceil(totalCount / pageSize));
                
                const bookings = response.value ?? [];

                const bookingPromises = bookings.map(async (booking) => {
                    const customerSelected = await fetchBasicCustomerInfo(booking.CustomerSelectedId);
                    booking.CustomerSelected = customerSelected;
                    return booking;
                });

                const completedBookings = await Promise.all(bookingPromises);
                setBookings(completedBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [currentPage, pageSize]);

    const fetchBookingDetails = async (bookingId) => {
        const booking = bookings.find(b => b.ID === bookingId);
        if (!booking) return;

        // Chỉ fetch chi tiết nếu chưa có trong state
        if (!bookingDetails[bookingId]) {
            const [customerSelected, artistStore] = await Promise.all([
                fetchCustomerSelected(booking.CustomerSelectedId),
                fetchArtistStore(booking.ArtistStoreId)
            ]);

            setBookingDetails(prev => ({
                ...prev,
                [bookingId]: {
                    customerSelected,
                    artistStore
                }
            }));
        }
    };

    const toggleBookingDetails = async (bookingId) => {
        if (expandedBookingId === bookingId) {
            setExpandedBookingId(null);
        } else {
            setExpandedBookingId(bookingId);
            await fetchBookingDetails(bookingId);
        }
    };

    const renderExpandedDetails = (booking) => {
        const details = bookingDetails[booking.ID];
        if (!details) return <tr><td colSpan="7"><div className="text-center">Đang tải...</div></td></tr>;

        return (
            <tr>
                <td colSpan="7">
                    <div className="p-3 bg-light">
                        <h6 className="mb-3">Chi tiết đặt lịch:</h6>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Thông tin khách hàng:</strong></p>
                                <p>Số điện thoại: {details.customerSelected.Customer.User.PhoneNumber}</p>
                                <p><strong>Thông tin Artist:</strong></p>
                                <p>Tên: {details.artistStore.Artist.User.FullName}</p>
                                <p>Kinh nghiệm: {details.artistStore.Artist.YearsOfExperience} năm</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Dịch vụ đã chọn:</strong></p>
                                <ul>
                                    {details.customerSelected.NailDesignServiceSelecteds.map((service, index) => (
                                        <li key={index}>
                                            {service.NailDesignService.NailDesign.Design.Name} - 
                                            {service.NailDesignService.Service.Name} 
                                            ({service.Duration} phút)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    // Thêm hàm mới để tạo mảng số trang
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(currentPage - halfVisible, 0);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 0);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    // Thêm hàm xử lý chuyển đến trang cụ thể
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            '-1': { label: 'Đã hủy', color: 'danger' },
            '0': { label: 'Chờ xác nhận', color: 'warning' },
            '1': { label: 'Đã xác nhận', color: 'info' },
            '2': { label: 'Đang phục vụ', color: 'primary' },
            '3': { label: 'Hoàn thành', color: 'success' }
        };

        const config = statusConfig[status] || { label: 'Không xác định', color: 'secondary' };

        return (
            <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color} px-2 py-1 rounded-pill`}>
                <i className={`bi bi-${getStatusIcon(status)} me-1`}></i>
                {config.label}
            </span>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case -1: return 'x-circle';
            case 0: return 'clock';
            case 1: return 'check-circle';
            case 2: return 'scissors';
            case 3: return 'check-circle-fill';
            default: return 'question-circle';
        }
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="7">
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <div className="spinner-border text-primary me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="text-muted">Đang tải dữ liệu...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (bookings.length === 0) {
            return (
                <tr>
                    <td colSpan="7">
                        <div className="text-center py-4">
                            <i className="bi bi-inbox text-muted fs-1"></i>
                            <p className="text-muted mt-2">Không có dữ liệu</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return bookings.map((booking) => (
            <React.Fragment key={booking.ID}>
                <tr className={booking.Status === -1 ? 'table-light' : ''}>
                    <td>
                        <button 
                            className="btn btn-sm btn-link"
                            onClick={() => toggleBookingDetails(booking.ID)}
                        >
                            <i className={`bi bi-chevron-${expandedBookingId === booking.ID ? 'up' : 'down'}`}></i>
                        </button>
                    </td>
                    <td>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person text-primary me-1"></i>
                            <span>{booking.CustomerSelected.Customer.User.FullName}</span>
                        </div>
                    </td>
                    <td>{getStatusBadge(booking.Status)}</td>
                    <td>{booking.ServiceDate}</td>
                    <td>{booking.StartTime}</td>
                    <td>
                        <span className="fw-medium">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(booking.TotalAmount)}
                        </span>
                    </td>
                    <td>
                        <div className="btn-group">
                            {booking.Status !== -1 && (
                                <>
                                    {booking.Status === 0 && (
                                        <button 
                                            className="btn btn-sm btn-outline-success me-1" 
                                            title="Xác nhận"
                                        >
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        title="Hủy booking"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </td>
                </tr>
                {expandedBookingId === booking.ID && renderExpandedDetails(booking)}
            </React.Fragment>
        ));
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Quản lý Booking</h5>
                </div>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Tên người đặt</th>
                                <th>Trạng thái</th>
                                <th>Ngày bắt đầu</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Tổng giá</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                        {!isLoading && `Hiển thị ${bookings.length} trong tổng số ${totalPages * pageSize} kết quả`}
                    </div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={handlePrevPage}
                                    aria-label="Previous"
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>

                            {currentPage > 1 && (
                                <>
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageClick(0)}>1</button>
                                    </li>
                                    {currentPage > 2 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                </>
                            )}

                            {getPageNumbers().map(pageNum => (
                                <li 
                                    key={pageNum} 
                                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                >
                                    <button 
                                        className="page-link"
                                        onClick={() => handlePageClick(pageNum)}
                                    >
                                        {pageNum + 1}
                                    </button>
                                </li>
                            ))}

                            {currentPage < totalPages - 2 && (
                                <>
                                    {currentPage < totalPages - 3 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    <li className="page-item">
                                        <button 
                                            className="page-link"
                                            onClick={() => handlePageClick(totalPages - 1)}
                                        >
                                            {totalPages}
                                        </button>
                                    </li>
                                </>
                            )}

                            <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={handleNextPage}
                                    aria-label="Next"
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="d-flex align-items-center">
                        <select 
                            className="form-select form-select-sm me-2" 
                            style={{ width: 'auto' }}
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            disabled={isLoading}
                        >
                            <option value="5">5 / trang</option>
                            <option value="10">10 / trang</option>
                            <option value="20">20 / trang</option>
                            <option value="50">50 / trang</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistBookingManagement;
