import axiosInstance from "./axiosConfig";

const artistService = {
  // Lấy danh sách artist
  getAllArtists: () => {
    return axiosInstance.get("/artists");
  },

  // Lấy thông tin chi tiết artist
  getArtistById: (id) => {
    return axiosInstance.get(`/artists/${id}`);
  },

  // Tạo artist mới
  createArtist: (artistData) => {
    return axiosInstance.post("/artists", artistData);
  },

  // Cập nhật thông tin artist
  updateArtist: (id, artistData) => {
    return axiosInstance.put(`/artists/${id}`, artistData);
  },

  // Xóa artist
  deleteArtist: (id) => {
    return axiosInstance.delete(`/artists/${id}`);
  },

  // Lấy danh sách artist theo store
  getArtistsByStore: (storeId) => {
    return axiosInstance.get(`/stores/${storeId}/artists`);
  },

  // Tìm kiếm artist
  searchArtists: (query) => {
    return axiosInstance.get(`/artists/search?q=${query}`);
  }
};

export default artistService;
