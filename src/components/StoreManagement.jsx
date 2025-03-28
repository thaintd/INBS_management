import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Modal, Form, Button } from "react-bootstrap";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    Address: "",
    Description: "",
    ImageUrl: "",
    NewImage: null,
    Status: 1
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axiosInstance.get(`/odata/store?$select=averageRating,status,imageUrl,description,address,id`);
      // Chuyển đổi status từ string sang số
      const storesWithNumericStatus = res.value.map((store) => ({
        ...store,
        Status: store.Status === "Active" ? 1 : 0
      }));
      setStores(storesWithNumericStatus);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleShowModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        Address: store.Address,
        Description: store.Description,
        ImageUrl: store.ImageUrl,
        NewImage: null,
        Status: store.Status
      });
    } else {
      setEditingStore(null);
      setFormData({
        Address: "",
        Description: "",
        ImageUrl: "",
        NewImage: null,
        Status: 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStore(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      NewImage: e.target.files[0]
    }));
  };

  const createStore = async (formDataToSend) => {
    try {
      await axiosInstance.post("/api/Store", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Store created successfully");
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  };

  const updateStore = async (id, formDataToSend) => {
    try {
      await axiosInstance.put(`/api/Store?id=${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Store updated successfully");
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingStore) {
        await updateStore(editingStore.ID, formDataToSend);
      } else {
        await createStore(formDataToSend);
      }

      handleCloseModal();
      fetchStores();
    } catch (error) {
      console.error("Error saving store:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa store này?")) {
      try {
        await axiosInstance.delete(`/api/Store?id=${id}`);
        fetchStores();
      } catch (error) {
        console.error("Error deleting store:", error);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Store</h5>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
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
                    <span className={`badge ${store.Status === 1 ? "bg-success" : "bg-danger"}`}>{store.Status === 1 ? "Hoạt động" : "Không hoạt động"}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleShowModal(store)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(store.ID)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStore ? "Chỉnh sửa Store" : "Thêm Store mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control type="text" name="Address" value={formData.Address} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              {formData.ImageUrl && !formData.NewImage && <img src={formData.ImageUrl} alt="Current" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select name="Status" value={formData.Status} onChange={handleInputChange} required>
                <option value={0}>Hoạt động</option>
                <option value={1}>Không hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingStore ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreManagement;
