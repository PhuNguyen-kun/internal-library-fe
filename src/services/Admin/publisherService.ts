import axiosInstance from "@/utils/axiosInstance";
import type {Publisher} from "@/types/Admin/publisher";

export const fetchPublishers = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get('/admin/publishers', {
      params: {
        search_term: searchTerm,
        per_page: perPage,
        page: page
      }
    });
    return {
      data: response.data.data, pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Failed to fetch authors', error);
    throw error;
  }
}

export const createPublisher = async (publisher: Publisher) => {
  try {
    const response = await axiosInstance.post("/admin/publishers", publisher);
    return response.data;
  } catch (error) {
    console.error('Failed to create author', error);
    throw error;
  }
}

export const updatePublisher = async (id: number, publisher: Publisher) => {
  try {
    const response = await axiosInstance.put(`/admin/publishers/${id}`, publisher);
    return response.data;
  } catch (error) {
    console.error('Failed to update publisher', error);
    throw error;
  }
}

export const deletePublisher = async (id: number) => {
  try {
    await axiosInstance.delete(`/admin/publishers/${id}`);
  } catch (error) {
    console.error(`Failed to delete publisher with id ${id}`, error);
    throw error;
  }
}


