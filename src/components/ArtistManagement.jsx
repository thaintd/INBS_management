import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Level: 1,
    YearsOfExperience: 0,
    FullName: "",
    NewImage: null,
    ImageUrl: "",
    PhoneNumber: "",
    Email: "",
    DateOfBirth: "",
    artistServices: [],
    artistStores: []
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/odata/artist?$select=id,username,yearsOfExperience,level,averageRating&$expand=user($select=fullName,phoneNumber,phoneNumber,email,DateOfBirth)`);
      setArtists(res.value);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (artist = null) => {
    if (artist) {
      setEditingArtist(artist);
      const dateOfBirth = artist.User?.DateOfBirth ? new Date(artist.User.DateOfBirth).toISOString().split("T")[0] : "";
      setFormData({
        Level: artist.Level || 1,
        YearsOfExperience: artist.YearsOfExperience || 0,
        FullName: artist.User?.FullName || "",
        ImageUrl: artist.User?.ImageUrl || "",
        PhoneNumber: artist.User?.PhoneNumber || "",
        Email: artist.User?.Email || "",
        DateOfBirth: dateOfBirth,
        NewImage: null,
        artistServices: [],
        artistStores: []
      });
    } else {
      setEditingArtist(null);
      setFormData({
        Level: 1,
        YearsOfExperience: 0,
        FullName: "",
        NewImage: null,
        ImageUrl: "",
        PhoneNumber: "",
        Email: "",
        DateOfBirth: "",
        artistServices: [],
        artistStores: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArtist(null);
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

  const createArtist = async (formDataToSend) => {
    try {
      await axiosInstance.post("/api/Artist", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Artist created successfully");
    } catch (error) {
      console.error("Error creating artist:", error);
      throw error;
    }
  };

  const updateArtist = async (id, formDataToSend) => {
    try {
      await axiosInstance.put(`/api/Artist?id=${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Artist updated successfully");
    } catch (error) {
      console.error("Error updating artist:", error);
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
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingArtist) {
        await updateArtist(editingArtist.ID, formDataToSend);
      } else {
        await createArtist(formDataToSend);
      }

      handleCloseModal();
      fetchArtists();
    } catch (error) {
      console.error("Error saving artist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa artist này?")) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/api/Artist?id=${id}`);
        fetchArtists();
      } catch (error) {
        console.error("Error deleting artist:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Artist</h5>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
            <i className="bi bi-plus-lg"></i> Thêm Artist
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
                  <th>Tên Artist</th>
                  <th>Username</th>
                  <th>Số điện thoại</th>
                  <th>Kinh nghiệm</th>
                  <th>Cấp độ</th>
                  <th>Đánh giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.ID}>
                    <td>{artist.User?.FullName}</td>
                    <td>{artist.Username}</td>
                    <td>{artist.User?.PhoneNumber}</td>
                    <td>{artist.YearsOfExperience} năm</td>
                    <td>
                      <span className={`badge ${artist.Level === 3 ? "bg-success" : artist.Level === 2 ? "bg-warning" : "bg-info"}`}>{artist.Level === 3 ? "Expert" : artist.Level === 2 ? "Intermediate" : "Beginner"}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <span>{artist.AverageRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleShowModal(artist)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(artist.ID)}>
                        <i className="bi bi-trash"></i>
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
          <Modal.Title>{editingArtist ? "Chỉnh sửa Artist" : "Thêm Artist mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control type="text" name="FullName" value={formData.FullName} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="Email" value={formData.Email} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleInputChange} required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số năm kinh nghiệm</Form.Label>
              <Form.Control type="number" name="YearsOfExperience" value={formData.YearsOfExperience} onChange={handleInputChange} min="0" required disabled={isSubmitting} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cấp độ</Form.Label>
              <Form.Select name="Level" value={formData.Level} onChange={handleInputChange} required disabled={isSubmitting}>
                <option value={1}>Beginner</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Expert</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
              {formData.ImageUrl && !formData.NewImage && <img src={formData.ImageUrl} alt="Current" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
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
                  {editingArtist ? "Đang cập nhật..." : "Đang thêm mới..."}
                </>
              ) : editingArtist ? (
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

export default ArtistManagement;
