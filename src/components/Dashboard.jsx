import React from "react";

const Dashboard = ({ setActiveTab }) => {
  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <i className="bi bi-shop text-primary fs-4"></i>
              </div>
              <h5 className="card-title mb-0 ms-3">Quản lý Store</h5>
            </div>
            <p className="card-text text-muted">Xem và quản lý thông tin các cửa hàng</p>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("store")}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <i className="bi bi-person text-success fs-4"></i>
              </div>
              <h5 className="card-title mb-0 ms-3">Quản lý Artist</h5>
            </div>
            <p className="card-text text-muted">Xem và quản lý thông tin nghệ sĩ</p>
            <button className="btn btn-outline-success" onClick={() => setActiveTab("artist")}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-info bg-opacity-10 p-3 rounded">
                <i className="bi bi-palette text-info fs-4"></i>
              </div>
              <h5 className="card-title mb-0 ms-3">Quản lý Nail Design</h5>
            </div>
            <p className="card-text text-muted">Xem và quản lý các mẫu nail design</p>
            <button className="btn btn-outline-info" onClick={() => setActiveTab("design")}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
