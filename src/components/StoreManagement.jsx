import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Address: "",
    Description: "",
    ImageUrl: "",
    NewImage: null,
    Status: 0,
    Latitude: null,
    Longtitude: null
  });
  const apiKey = 'acgv5qe4CqAiZV3MCMWmMdbpMMvSX4qqyNyvPLsE'

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/odata/store?$select=province,averageRating,status,imageUrl,description,address,id,isDeleted,longtitude,latitude`);
      console.log(res);
      
      // Chuyển đổi status từ string sang số
      const storesWithNumericStatus = res.value.map((store) => ({
        ...store,
        Status: store.Status === "Active" ? 1 : 0
      }));
      setStores(storesWithNumericStatus);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        Province: store.Province,
        Address: store.Address,
        Description: store.Description,
        ImageUrl: store.ImageUrl,
        NewImage: null,
        Status: store.Status,
        IsDeleted: store.IsDeleted,
        Latitude: store.Latitude,
        Longtitude: store.Longtitude
      });
    } else {
      setEditingStore(null);
      setFormData({
        Province: "",
        Address: "",
        Description: "",
        ImageUrl: "",
        NewImage: null,
        Status: 0,
        IsDeleted: true,
        Latitude: null,
        Longtitude: null
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
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          console.log(formData[key]);
          
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, isDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn " + (!isDelete ? "ẩn" : "hiện") + " store này?")) {
      setIsLoading(true);
      try {
        await axiosInstance.patch(`/api/Store?id=${id}`);
        fetchStores();
      } catch (error) {
        console.error("Error deleting store:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

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
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tỉnh</th>
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
                    <td>{store.Province}</td>
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
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(store.ID,store.IsDeleted)}>
                        {
                          store.IsDeleted ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStore ? "Chỉnh sửa Store" : "Thêm Store mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <AddressFormGroup
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              apiKey={apiKey}
            />
            <Form.Group className="mb-3">
              <Form.Label>Tỉnh</Form.Label>
              <Form.Control type="text" name="Province" value={formData.Province} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
              {formData.ImageUrl && !formData.NewImage && <img src={formData.ImageUrl} alt="Current" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select name="Status" value={formData.Status} onChange={handleInputChange} required disabled={isSubmitting}>
                <option value={0}>Hoạt động</option>
                <option value={1}>Không hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  {editingStore ? "Đang cập nhật..." : "Đang thêm mới..."}
                </>
              ) : editingStore ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

const AddressFormGroup = ({ formData, setFormData, isSubmitting, apiKey }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState(formData.Address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchLength, setLastSearchLength] = useState(0);

  useEffect(() => {
    setSearchText(formData.Address || '');
  }, [formData.Address]);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Chỉ gọi API khi độ dài text hiện tại so với lần search trước tăng thêm 3 ký tự
    if (value.length >= 3 && value.length >= lastSearchLength + 3) {
      setIsLoading(true);
      setLastSearchLength(value.length);

      const delayDebounce = setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(value)}`
          );
          setSuggestions(response.data.predictions || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else if (value.length < 3) {
      // Reset khi text ngắn hơn 3 ký tự
      setSuggestions([]);
      setLastSearchLength(0);
    }
  };

  const handleSelectAddress = async (place) => {
    try {
      setIsLoading(true);
      // Gọi API Detail để lấy lat, lng
      const detailResponse = await axios.get(
        `https://rsapi.goong.io/Place/Detail?place_id=${place.place_id}&api_key=${apiKey}`
      );

      const location = detailResponse.data.result.geometry.location;
      
      setSearchText(place.description);
      setSuggestions([]);
      setLastSearchLength(0);
      
      setFormData(prev => ({
        ...prev,
        Address: place.structured_formatting.main_text,
        Description: place.description,
        Province: place.terms ? place.terms[place.terms.length - 1].value : '',
        Latitude: location.lat,
        Longtitude: location.lng
      }));
    } catch (error) {
      console.error('Error fetching place details:', error);
      // Fallback nếu có lỗi
      setFormData(prev => ({
        ...prev,
        Address: place.description,
        Province: place.terms ? place.terms[place.terms.length - 1].value : ''
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Địa chỉ</Form.Label>
      <div className="position-relative">
        <div className="input-group">
          <Form.Control
            type="text"
            value={searchText}
            onChange={handleAddressChange}
            placeholder="Nhập địa chỉ..."
            disabled={isSubmitting}
          />
          {isLoading && (
            <span className="input-group-text">
              <span className="spinner-border spinner-border-sm" />
            </span>
          )}
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectAddress(place)}
              >
                {place.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      {searchText.length > 0 && searchText.length < 3 && (
        <Form.Text className="text-muted">
          Nhập thêm {3 - searchText.length} ký tự để bắt đầu tìm kiếm
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default StoreManagement;
