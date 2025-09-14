import axios from "@/lib/axios";

const keluargaService = {
  // Get all keluargas with pagination and search
  getAll: async (params = {}) => {
    const response = await axios.get("/keluarga", { params });

    return response.data;
  },

  // Get keluarga by ID
  getById: async (id) => {
    const response = await axios.get(`/keluarga/${id}`);

    return response.data;
  },

  // Create new keluarga
  create: async (data) => {
    const response = await axios.post("/keluarga", data);

    return response.data;
  },

  // Update keluarga
  update: async (id, data) => {
    const response = await axios.patch(`/keluarga/${id}`, data);

    return response.data;
  },

  // Delete keluarga
  delete: async (id) => {
    const response = await axios.delete(`/keluarga/${id}`);

    return response.data;
  },
};

export default keluargaService;
