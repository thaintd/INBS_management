import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [services, setServices] = useState([]);
  const [stores, setStores] = useState([]);

  const id = '8a3a946e-8690-4b9d-96da-2bc28e112bd1';

  const fetchService = async () => {
    setIsLoading(true);
    try {
      const uri = "/odata/service?";
      const filter = `$filter=isDeleted eq false`;
      const selectService = `&$select=id,name,description,imageUrl,price`;
      
      const res = await axiosInstance.get(`${uri}${filter}${selectService}`);
      const servicesRes = res.data.value;
      setServices(servicesRes);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const uri = "/odata/store?";
      const filter = `$filter=isDeleted eq false`;
      const selectStore = `&$select=id,province,description,address,imageUrl,latitude,longtitude`;
      
      const res = await axiosInstance.get(`${uri}${filter}${selectStore}`);
      const storesRes = res.data.value;
      setStores(storesRes);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtist = async() => {
    setIsLoading(true);
    try {
      const uri = "/odata/artist?";
      const filter = `$filter=id eq ${id}`;
      const selectArtist = `&$select=id,username,yearsOfExperience,level,averageRating`;
      const expandUser = `&$expand=user($select=fullName,email,phoneNumber,imageUrl,dateOfBirth)`;
      const expandArtistStore = `,artistStores($select=storeId,workingDate,startTime,endTime,breakTime;$expand=store($select=id,province,address,description,latitude,longtitude))`;
      const expandArtistService = `,artistServices($select=serviceId;$expand=service($select=id,name,description,imageUrl,price))`;
      
      const res = await axiosInstance.get(`${uri}${filter}${selectArtist}${expandUser}${expandArtistService}${expandArtistStore}`);
console.log(res);

      const artistRes = res.value[0];      
      setArtist(artistRes);
    } catch (error) {
      console.error('Error fetching artist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">
          Không tìm thấy thông tin artist
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <img 
                    src={artist.User.ImageUrl} 
                    alt={artist.User.FullName} 
                    className="rounded-circle"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h2 className="mb-1">{artist.User.FullName}</h2>
                  <p className="text-muted mb-1">Level: {artist.Level}</p>
                  <p className="text-muted">Kinh nghiệm: {artist.YearsOfExperience} năm</p>
                  {artist.AverageRating && (
                    <p className="text-muted">Đánh giá: {artist.AverageRating}/5</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title border-bottom pb-3">Thông tin cá nhân</h4>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <strong className="text-muted">Email:</strong>
                    <p className="mb-0">{artist.User.Email}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <strong className="text-muted">Số điện thoại:</strong>
                    <p className="mb-0">{artist.User.PhoneNumber}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <strong className="text-muted">Ngày sinh:</strong>
                    <p className="mb-0">
                      {new Date(artist.User.DateOfBirth).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title border-bottom pb-3">Dịch vụ chuyên môn</h4>
              <div className="d-flex flex-wrap gap-2">
                {artist.ArtistServices?.map(as => (
                  <span 
                    key={as.Service.Id} 
                    className="badge bg-secondary rounded-pill"
                  >
                    {as.Service.Name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title border-bottom pb-3">Lịch làm việc</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Ngày làm việc</th>
                      <th>Giờ bắt đầu</th>
                      <th>Giờ kết thúc</th>
                      <th>Thời gian giải lao</th>
                      <th>Địa chỉ</th>
                      <th>Mô tả của cửa hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artist.ArtistStores?.map((store) => (
                      <tr key={store.StoreId}>
                        <td>{new Date(store.WorkingDate).toLocaleDateString('vi-VN')}</td>
                        <td>{store.StartTime}</td>
                        <td>{store.EndTime}</td>
                        <td>{store.BreakTime}</td>
                        <td>{store.Store.Address}</td>
                        <td>{store.Store.Description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
