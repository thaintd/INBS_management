import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";

const DesignManagement = () => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const getDesigns = async () => {
      try {
        const res = await axiosInstance.get(`/odata/design?$select=id,name,trendscore,averageRating&$expand=medias($orderby=numerialOrder asc;$top=1;$select=imageUrl)`);
        setDesigns(res.value);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
    };
    getDesigns();
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Design</h5>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm Design
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên Design</th>
                <th>Trend Score</th>
                <th>Đánh giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design.ID}>
                  <td>
                    <img src={design.Medias?.[0]?.ImageUrl || "https://via.placeholder.com/50"} alt={design.Name} className="img-thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  </td>
                  <td>{design.Name}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-fire text-danger me-1"></i>
                      <span>{design.TrendScore}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span>{design.AverageRating.toFixed(1)}</span>
                    </div>
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

export default DesignManagement;
