import axios from "@/lib/axios";

const jenisIbadahService = {
  // Get all jenis ibadah with pagination and search
  getAll: async (params = {}) => {
    const response = await axios.get("/jenis-ibadah", { params });

    return response.data;
  },

  // Get jenis ibadah by ID
  getById: async (id) => {
    const response = await axios.get(`/jenis-ibadah/${id}`);

    return response.data;
  },

  // Create new jenis ibadah
  create: async (data) => {
    const response = await axios.post("/jenis-ibadah", data);

    return response.data;
  },

  // Update jenis ibadah
  update: async (id, data) => {
    const response = await axios.patch(`/jenis-ibadah/${id}`, data);

    return response.data;
  },

  // Delete jenis ibadah
  delete: async (id) => {
    const response = await axios.delete(`/jenis-ibadah/${id}`);

    return response.data;
  },
};

export default jenisIbadahService;
