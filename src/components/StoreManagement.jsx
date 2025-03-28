import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const handleGetStore = async () => {
      try {
        const res = await axiosInstance.get(`/odata/store?$select=averageRating,status,imageUrl,description,address,id`);
        setStores(res.value);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    handleGetStore();
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Store</h5>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm Store
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Địa chỉ</th>
                <th>Mô tả</th>
                <th>Đánh giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.ID}>
                  <td>
                    <img src={store.ImageUrl} alt={store.Description} className="img-thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  </td>
                  <td>{store.Address}</td>
                  <td>{store.Description}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span>{store.AverageRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${store.Status === "Active" ? "bg-success" : "bg-danger"}`}>{store.Status}</span>
                  </td>
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

export default StoreManagement;
