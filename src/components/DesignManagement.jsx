import React from "react";

const DesignManagement = () => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Nail Design</h5>
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
                <th>ID</th>
                <th>Tên Design</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Artist</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#001</td>
                <td>French Manicure</td>
                <td>Kiểu nail cổ điển</td>
                <td>300,000đ</td>
                <td>Nguyễn Thị B</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">
                    <i className="bi bi-pencil"></i>
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
  );
};

export default DesignManagement;
