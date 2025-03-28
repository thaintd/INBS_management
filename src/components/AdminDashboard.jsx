import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import StoreManagement from "./StoreManagement";
import ArtistManagement from "./ArtistManagement";
import DesignManagement from "./DesignManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "store":
        return <StoreManagement />;
      case "artist":
        return <ArtistManagement />;
      case "design":
        return <DesignManagement />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content */}
        <main className="col-md-10 ms-sm-auto px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button type="button" className="btn btn-sm btn-outline-secondary">
                <i className="bi bi-bell"></i> Thông báo
              </button>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
