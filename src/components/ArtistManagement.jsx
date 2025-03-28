import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const handleGetArtist = async () => {
      try {
        const res = await axiosInstance.get(`/odata/artist?$select=id,username,yearsOfExperience,level,averageRating&$expand=user($select=fullName,phoneNumber,phoneNumber)`);
        setArtists(res.value);
        console.log(res);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    handleGetArtist();
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Quản lý Artist</h5>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm Artist
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
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
                    <span className={`badge ${artist.Level === "Expert" ? "bg-success" : artist.Level === "Intermediate" ? "bg-warning" : "bg-info"}`}>{artist.Level}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span>{artist.AverageRating}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArtistManagement;
