import axiosInstance from "@/utils/axiosInstance";

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategories = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get("/admin/categories", {
      params: {
        search_term: searchTerm,
        per_page: perPage,
        page: page
      },
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  try {
    console.log('Sending API request with data:', category);
    const response = await axiosInstance.post("/admin/categories", category);
    return response.data;
  } catch (error) {
    console.error("Failed to create employee:", error);
    throw error;
  }
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  try {
    const response = await axiosInstance.put(`/admin/categories/${id}`, category);
    return response.data;
  } catch (error) {
      console.error('Failed to update employee', error);
    throw error;
    }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/categories/${id}`);
  } catch (error) {
    console.error(`Failed to delete category with id ${id}:`, error);
    throw error;
  }
};


