import axiosInstance from "./axiosConfig";

const designService = {
  // Lấy danh sách design
  getAllDesigns: () => {
    return axiosInstance.get("/designs");
  },

  // Lấy thông tin chi tiết design
  getDesignById: (id) => {
    return axiosInstance.get(`/designs/${id}`);
  },

  // Tạo design mới
  createDesign: (designData) => {
    return axiosInstance.post("/designs", designData);
  },

  // Cập nhật thông tin design
  updateDesign: (id, designData) => {
    return axiosInstance.put(`/designs/${id}`, designData);
  },

  // Xóa design
  deleteDesign: (id) => {
    return axiosInstance.delete(`/designs/${id}`);
  },

  // Lấy danh sách design theo artist
  getDesignsByArtist: (artistId) => {
    return axiosInstance.get(`/artists/${artistId}/designs`);
  },

  // Lấy danh sách design theo store
  getDesignsByStore: (storeId) => {
    return axiosInstance.get(`/stores/${storeId}/designs`);
  },

  // Tìm kiếm design
  searchDesigns: (query) => {
    return axiosInstance.get(`/designs/search?q=${query}`);
  }
};

export default designService;
