import axios from "@/lib/axios";

const statisticsService = {
  // Get overview statistics
  getOverview: async () => {
    const response = await axios.get("/statistics/overview");
    return response.data;
  },

  // Get growth trends
  getGrowth: async (params = {}) => {
    const response = await axios.get("/statistics/growth", { params });
    return response.data;
  },

  // Get demographics
  getDemographics: async () => {
    const response = await axios.get("/statistics/demographics");
    return response.data;
  },
};

export default statisticsService;