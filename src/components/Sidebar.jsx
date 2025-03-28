import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="col-md-2 d-none d-md-block bg-dark sidebar min-vh-100">
      <div className="position-sticky pt-3">
        <div className="text-center mb-4">
          <h4 className="text-white">Admin Panel</h4>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "dashboard" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("dashboard");
              }}
            >
              <i className="bi bi-house-door me-2"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "store" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("store");
              }}
            >
              <i className="bi bi-shop me-2"></i> Quản lý Store
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "artist" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("artist");
              }}
            >
              <i className="bi bi-person me-2"></i> Quản lý Artist
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "design" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("design");
              }}
            >
              <i className="bi bi-palette me-2"></i> Quản lý Design
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "service" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("service");
              }}
            >
              <i className="bi bi-palette me-2"></i> Quản lý Service
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-white d-flex align-items-center ${activeTab === "booking" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("booking");
              }}
            >
              <i className="bi bi-palette me-2"></i> Quản lý Booking
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
