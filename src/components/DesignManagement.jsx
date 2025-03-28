import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Modal, Form, Button, ListGroup } from "react-bootstrap";

const DesignManagement = () => {
  const [designs, setDesigns] = useState([]);
  const [expandedDesigns, setExpandedDesigns] = useState(new Set());
  const [designDetails, setDesignDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    TrendScore: 0,
    Description: "",
    ColorIds: [],
    OccasionIds: [],
    SkintoneIds: [],
    PaintTypeIds: [],
    medias: [],
    nailDesigns: []
  });
  const [colors, setColors] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [skintones, setSkintones] = useState([]);
  const [paintTypes, setPaintTypes] = useState([]);
  const [services, setServices] = useState([]);

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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [colorsRes, occasionsRes, skintonesRes, paintTypesRes, servicesRes] = await Promise.all([axiosInstance.get("/api/Adjective/Colors"), axiosInstance.get("/api/Adjective/Occasions"), axiosInstance.get("/api/Adjective/Skintone"), axiosInstance.get("/api/Adjective/PaintType"), axiosInstance.get(`/odata/service?$select=id,name,price,imageUrl,description`)]);
        setColors(colorsRes);
        setOccasions(occasionsRes);
        setSkintones(skintonesRes);
        setPaintTypes(paintTypesRes);
        setServices(servicesRes.value);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      Name: "",
      TrendScore: 0,
      Description: "",
      ColorIds: [],
      OccasionIds: [],
      SkintoneIds: [],
      PaintTypeIds: [],
      medias: [],
      nailDesigns: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (id, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter((item) => item !== id) : [...prev[field], id]
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      medias: files.map((file, index) => ({
        newImage: file,
        imageUrl: URL.createObjectURL(file),
        numerialOrder: index + 1
      }))
    }));
  };

  const handleNailDesignChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nailDesigns: prev.nailDesigns.map((design, i) => (i === index ? { ...design, [name]: value } : design))
    }));
  };

  const addNailDesign = () => {
    setFormData((prev) => ({
      ...prev,
      nailDesigns: [
        ...prev.nailDesigns,
        {
          newImage: null,
          imageUrl: "",
          nailPosition: 0,
          isLeft: true,
          nailDesignServices: []
        }
      ]
    }));
  };

  const removeNailDesign = (index) => {
    setFormData((prev) => ({
      ...prev,
      nailDesigns: prev.nailDesigns.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Handle basic fields
      formDataToSend.append("Name", formData.Name);
      formDataToSend.append("TrendScore", parseFloat(formData.TrendScore));
      formDataToSend.append("Description", formData.Description);

      // Handle arrays - send each item separately
      formData.ColorIds.forEach((id, index) => {
        formDataToSend.append(`ColorIds[${index}]`, id);
      });

      formData.OccasionIds.forEach((id, index) => {
        formDataToSend.append(`OccasionIds[${index}]`, id);
      });

      formData.SkintoneIds.forEach((id, index) => {
        formDataToSend.append(`SkintoneIds[${index}]`, id);
      });

      formData.PaintTypeIds.forEach((id, index) => {
        formDataToSend.append(`PaintTypeIds[${index}]`, id);
      });

      // Handle medias
      formData.medias.forEach((media, index) => {
        formDataToSend.append(`medias[${index}].newImage`, media.newImage);
        formDataToSend.append(`medias[${index}].numerialOrder`, media.numerialOrder);
      });

      // Handle nailDesigns
      formData.nailDesigns.forEach((design, index) => {
        formDataToSend.append(`nailDesigns[${index}].newImage`, design.newImage);
        formDataToSend.append(`nailDesigns[${index}].imageUrl`, design.imageUrl);
        formDataToSend.append(`nailDesigns[${index}].nailPosition`, design.nailPosition);
        formDataToSend.append(`nailDesigns[${index}].isLeft`, design.isLeft);

        design.nailDesignServices.forEach((service, serviceIndex) => {
          formDataToSend.append(`nailDesigns[${index}].nailDesignServices[${serviceIndex}].serviceId`, service.serviceId);
          formDataToSend.append(`nailDesigns[${index}].nailDesignServices[${serviceIndex}].extraPrice`, service.extraPrice);
        });
      });

      await axiosInstance.post("/api/Design", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      handleCloseModal();
      // Refresh designs list
      const res = await axiosInstance.get(`/odata/design?$select=id,name,trendscore,averageRating&$expand=medias($orderby=numerialOrder asc;$top=1;$select=imageUrl)`);
      setDesigns(res.value);
    } catch (error) {
      console.error("Error creating design:", error);
      if (error.response?.data?.errors) {
        // Log validation errors
        console.error("Validation errors:", error.response.data.errors);
      }
    }
  };

  const getDesignDetails = async (id) => {
    try {
      // Get basic design info with medias, preferences, and nailDesigns
      const designRes = await axiosInstance.get(`/odata/design?$filter=id eq ${id}&$select=id,name,description,trendscore&$expand=medias($select=numerialOrder,imageUrl,mediatype),preferences,nailDesigns($select=id,imageUrl,nailposition,isleft)`);
      const design = designRes.value[0];

      // Get nailDesignServices for each nailDesign
      const nailDesignServiceRequests = design.NailDesigns.map((NailDesign) => axiosInstance.get(`/odata/NailDesignService?$filter=nailDesignId eq ${NailDesign.ID}&$select=id,serviceId`));
      const nailDesignServicesRes = await Promise.all(nailDesignServiceRequests);

      const nailDesignServices = nailDesignServicesRes.reduce((acc, res, index) => {
        acc[design.NailDesigns[index].ID] = res.value ?? [];
        return acc;
      }, {});

      // Get service details
      const allServices = Object.values(nailDesignServices).flat();
      const serviceIds = [...new Set(allServices.map((service) => service?.ServiceId))];

      const serviceRequests = serviceIds.map((serviceId) => axiosInstance.get(`/odata/service?$filter=id eq ${serviceId}&$select=id,name,imageUrl,price,isAdditional,averageDuration`));
      const servicesRes = await Promise.all(serviceRequests);
      const services = servicesRes.map((res) => res.value[0]);

      // Combine all data
      const nailDesignsWithServices = design.NailDesigns.map((NailDesign) => ({
        ...NailDesign,
        nailDesignServices: (nailDesignServices[NailDesign.ID] || []).map((nds) => ({
          ...nds,
          service: services.find((s) => s.ID === nds.ServiceId)
        }))
      }));

      setDesignDetails((prev) => ({
        ...prev,
        [id]: {
          ...design,
          NailDesigns: nailDesignsWithServices
        }
      }));
    } catch (error) {
      console.error("Error fetching design details:", error);
    }
  };

  const toggleDesign = (id) => {
    setExpandedDesigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        if (!designDetails[id]) {
          getDesignDetails(id);
        }
      }
      return newSet;
    });
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Design</h5>
          <button type="button" className="btn btn-sm btn-primary" onClick={handleShowModal}>
            <i className="bi bi-plus-lg"></i> Thêm Design
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "50px" }}></th>
                <th>Hình ảnh</th>
                <th>Tên Design</th>
                <th>Trend Score</th>
                <th>Đánh giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <React.Fragment key={design.ID}>
                  <tr>
                    <td>
                      <button className="btn btn-sm btn-link p-0" onClick={() => toggleDesign(design.ID)}>
                        <i className={`bi bi-chevron-${expandedDesigns.has(design.ID) ? "down" : "right"}`}></i>
                      </button>
                    </td>
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
                  {expandedDesigns.has(design.ID) && designDetails[design.ID] && (
                    <tr>
                      <td colSpan="6">
                        <div className="p-3 bg-light">
                          <h6 className="mb-3">Chi tiết Design</h6>
                          <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                              <thead>
                                <tr>
                                  <th style={{ width: "100px" }}>Hình ảnh</th>
                                  <th>Vị trí</th>
                                  <th>Bên</th>
                                  <th>Dịch vụ</th>
                                </tr>
                              </thead>
                              <tbody>
                                {designDetails[design.ID].NailDesigns.map((nailDesign) => (
                                  <tr key={nailDesign.ID}>
                                    <td>
                                      <div className="d-flex justify-content-center">
                                        <img
                                          src={nailDesign.ImageUrl}
                                          alt={`Nail Design ${nailDesign.NailPosition}`}
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "4px"
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>{nailDesign.NailPosition}</td>
                                    <td>{nailDesign.isleft ? "Trái" : "Phải"}</td>
                                    <td>
                                      <div className="table-responsive">
                                        <table className="table table-sm table-bordered mb-0">
                                          <thead>
                                            <tr>
                                              <th>Tên dịch vụ</th>
                                              <th>Giá</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {nailDesign.nailDesignServices.map((nds) => (
                                              <tr key={nds.ID}>
                                                <td>{nds.service.Name}</td>
                                                <td className="text-primary">{nds.service.Price.toLocaleString()}đ</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Design mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên Design</Form.Label>
              <Form.Control type="text" name="Name" value={formData.Name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trend Score</Form.Label>
              <Form.Control type="number" name="TrendScore" value={formData.TrendScore} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Màu sắc</Form.Label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup>
                  {colors.map((color) => (
                    <ListGroup.Item key={color.id}>
                      <Form.Check type="checkbox" id={`color-${color.id}`} label={color.colorName} checked={formData.ColorIds.includes(color.id)} onChange={() => handleCheckboxChange(color.id, "ColorIds")} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dịp</Form.Label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup>
                  {occasions.map((occasion) => (
                    <ListGroup.Item key={occasion.id}>
                      <Form.Check type="checkbox" id={`occasion-${occasion.id}`} label={occasion.name} checked={formData.OccasionIds.includes(occasion.id)} onChange={() => handleCheckboxChange(occasion.id, "OccasionIds")} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Màu da</Form.Label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup>
                  {skintones.map((skintone) => (
                    <ListGroup.Item key={skintone.id}>
                      <Form.Check type="checkbox" id={`skintone-${skintone.id}`} label={skintone.name} checked={formData.SkintoneIds.includes(skintone.id)} onChange={() => handleCheckboxChange(skintone.id, "SkintoneIds")} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại sơn</Form.Label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup>
                  {paintTypes.map((paintType) => (
                    <ListGroup.Item key={paintType.id}>
                      <Form.Check type="checkbox" id={`paintType-${paintType.id}`} label={paintType.name} checked={formData.PaintTypeIds.includes(paintType.id)} onChange={() => handleCheckboxChange(paintType.id, "PaintTypeIds")} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh Design</Form.Label>
              <Form.Control type="file" multiple onChange={handleMediaChange} accept="image/*" required />
              <div className="d-flex flex-wrap gap-2 mt-2">
                {formData.medias.map((media, index) => (
                  <img key={index} src={media.imageUrl} alt={`Design ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ))}
              </div>
            </Form.Group>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Nail Designs</h6>
                <Button variant="outline-primary" size="sm" onClick={addNailDesign}>
                  <i className="bi bi-plus-lg"></i> Thêm Nail Design
                </Button>
              </div>
              {formData.nailDesigns.map((design, index) => (
                <div key={index} className="border p-3 mb-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="mb-0">Nail Design {index + 1}</h6>
                    <Button variant="outline-danger" size="sm" onClick={() => removeNailDesign(index)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>Hình ảnh</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        handleNailDesignChange(
                          {
                            target: {
                              name: "newImage",
                              value: file
                            }
                          },
                          index
                        );
                        handleNailDesignChange(
                          {
                            target: {
                              name: "imageUrl",
                              value: URL.createObjectURL(file)
                            }
                          },
                          index
                        );
                      }}
                      accept="image/*"
                      required
                    />
                    {design.imageUrl && <img src={design.imageUrl} alt={`Nail Design ${index + 1}`} className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Vị trí</Form.Label>
                    <Form.Control type="number" name="nailPosition" value={design.nailPosition} onChange={(e) => handleNailDesignChange(e, index)} required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Bên</Form.Label>
                    <Form.Select name="isLeft" value={design.isLeft} onChange={(e) => handleNailDesignChange(e, index)} required>
                      <option value={true}>Trái</option>
                      <option value={false}>Phải</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Dịch vụ</Form.Label>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      <ListGroup>
                        {services.map((service) => (
                          <ListGroup.Item key={service.ID}>
                            <Form.Check
                              type="checkbox"
                              id={`service-${service.ID}-${index}`}
                              label={`${service.Name} - ${service.Price.toLocaleString()}đ`}
                              checked={design.nailDesignServices.some((s) => s.serviceId === service.ID)}
                              onChange={() => {
                                const newServices = design.nailDesignServices.some((s) => s.serviceId === service.ID) ? design.nailDesignServices.filter((s) => s.serviceId !== service.ID) : [...design.nailDesignServices, { serviceId: service.ID, extraPrice: 0 }];
                                handleNailDesignChange(
                                  {
                                    target: {
                                      name: "nailDesignServices",
                                      value: newServices
                                    }
                                  },
                                  index
                                );
                              }}
                            />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Form.Group>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Thêm mới
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DesignManagement;
