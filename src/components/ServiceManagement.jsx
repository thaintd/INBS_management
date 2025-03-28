import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axiosInstance.get(`/odata/service?$select=id,name,price,imageUrl,description`);
        setServices(res.value);
        console.log(res.value);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    getServices();
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Dịch vụ</h5>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm Dịch vụ
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên Dịch vụ</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.ID}>
                  <td>
                    <img src={service.ImageUrl || "https://via.placeholder.com/50"} alt={service.Name} className="img-thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  </td>
                  <td>{service.Name}</td>
                  <td>{service.Description}</td>
                  <td>{service.Price.toLocaleString("vi-VN")}đ</td>

                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
