import axiosInstance from "@/utils/axiosInstance";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/admin/categories", {
      params: { per_page: 100 },
    });
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error('Failed to fetch categories', error);
    throw error;
  }
};
