import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ArtistDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-2 d-none d-md-block bg-dark sidebar min-vh-100">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h4 className="text-white">Artist Panel</h4>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active text-white d-flex align-items-center" href="#">
                  <i className="bi bi-house-door me-2"></i> Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white d-flex align-items-center" href="#">
                  <i className="bi bi-cash me-2"></i> Quản lý Payment
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-10 ms-sm-auto px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Artist Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button type="button" className="btn btn-sm btn-outline-secondary me-2">
                <i className="bi bi-bell"></i> Thông báo
              </button>
              <button type="button" className="btn btn-sm btn-primary">
                <i className="bi bi-plus-lg"></i> Thêm Payment
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Quản lý Payment</h5>
                    <div className="input-group" style={{ width: "300px" }}>
                      <input type="text" className="form-control" placeholder="Tìm kiếm..." />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Ngày</th>
                          <th>Khách hàng</th>
                          <th>Số tiền</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>#001</td>
                          <td>2024-03-28</td>
                          <td>Nguyễn Văn A</td>
                          <td className="fw-bold">500,000đ</td>
                          <td>
                            <span className="badge bg-success">Đã thanh toán</span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArtistDashboard;
