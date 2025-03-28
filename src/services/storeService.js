import axiosInstance from "./axiosConfig";

const storeService = {
  // Lấy danh sách store
  getAllStores: () => {
    return axiosInstance.get("/stores");
  },

  // Lấy thông tin chi tiết store
  getStoreById: (id) => {
    return axiosInstance.get(`/stores/${id}`);
  },

  // Tạo store mới
  createStore: (storeData) => {
    return axiosInstance.post("/stores", storeData);
  },

  // Cập nhật thông tin store
  updateStore: (id, storeData) => {
    return axiosInstance.put(`/stores/${id}`, storeData);
  },

  // Xóa store
  deleteStore: (id) => {
    return axiosInstance.delete(`/stores/${id}`);
  },

  // Tìm kiếm store
  searchStores: (query) => {
    return axiosInstance.get(`/stores/search?q=${query}`);
  }
};

export default storeService;
