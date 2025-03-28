import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Modal, Form, Button, ListGroup } from "react-bootstrap";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: 0,
    ImageUrl: "",
    NewImage: null,
    IsAdditional: false,
    CategoryIds: [],
    serviceNailDesigns: []
  });

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axiosInstance.get(`/odata/service?$select=id,name,price,imageUrl,description,isAdditional`);
        setServices(res.value);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    getServices();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axiosInstance.get("api/Adjective/Categories");
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleShowModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        Name: service.Name,
        Description: service.Description,
        Price: service.Price,
        ImageUrl: service.ImageUrl,
        NewImage: null,
        IsAdditional: service.IsAdditional,
        CategoryIds: [],
        serviceNailDesigns: []
      });
    } else {
      setEditingService(null);
      setFormData({
        Name: "",
        Description: "",
        Price: 0,
        ImageUrl: "",
        NewImage: null,
        IsAdditional: false,
        CategoryIds: [],
        serviceNailDesigns: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      NewImage: file,
      ImageUrl: URL.createObjectURL(file)
    }));
  };

  const handleCheckboxChange = (id, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter((item) => item !== id) : [...prev[field], id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Handle basic fields
      formDataToSend.append("Name", formData.Name);
      formDataToSend.append("Description", formData.Description);
      formDataToSend.append("Price", formData.Price);
      formDataToSend.append("IsAdditional", formData.IsAdditional);

      // Handle image
      if (formData.NewImage) {
        formDataToSend.append("NewImage", formData.NewImage);
      }
      if (formData.ImageUrl) {
        formDataToSend.append("ImageUrl", formData.ImageUrl);
      }

      // Handle categories
      formData.CategoryIds.forEach((id, index) => {
        formDataToSend.append(`CategoryIds[${index}]`, id);
      });

      if (editingService) {
        await axiosInstance.put(`/api/Service?id=${editingService.ID}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        await axiosInstance.post("/api/Service", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }

      handleCloseModal();
      // Refresh services list
      const res = await axiosInstance.get(`/odata/service?$select=id,name,price,imageUrl,description,isAdditional`);
      setServices(res.value);
    } catch (error) {
      console.error("Error saving service:", error);
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await axiosInstance.delete(`/api/Service?id=${id}`);
        // Refresh services list
        const res = await axiosInstance.get(`/odata/service?$select=id,name,price,imageUrl,description,isAdditional`);
        setServices(res.value);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Dịch vụ</h5>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
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
                <th>Loại</th>
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
                    <span className={`badge ${service.IsAdditional ? "bg-warning" : "bg-primary"}`}>{service.IsAdditional ? "Dịch vụ bổ sung" : "Dịch vụ chính"}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleShowModal(service)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.ID)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? "Chỉnh sửa Dịch vụ" : "Thêm Dịch vụ mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên Dịch vụ</Form.Label>
              <Form.Control type="text" name="Name" value={formData.Name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control type="number" name="Price" value={formData.Price} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              {formData.ImageUrl && <img src={formData.ImageUrl} alt="Preview" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" name="IsAdditional" label="Dịch vụ bổ sung" checked={formData.IsAdditional} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup>
                  {categories.map((category) => (
                    <ListGroup.Item key={category.id}>
                      <Form.Check type="checkbox" id={`category-${category.id}`} label={category.name} checked={formData.CategoryIds.includes(category.id)} onChange={() => handleCheckboxChange(category.id, "CategoryIds")} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingService ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
