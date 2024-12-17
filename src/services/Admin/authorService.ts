import axiosInstance from "@/utils/axiosInstance";
import type { Author } from '@/types/Admin/author';

export const getAuthors = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get("/admin/authors", {
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

export const createAuthor = async (author: Author) => {
  try {
    const response = await axiosInstance.post("/admin/authors", author);
    return response.data;
  } catch (error) {
    console.error('Failed to create author', error);
    throw error;
  }
}

export const updateAuthor = async (id: number, author: Author) => {
  try {
    const response = await axiosInstance.put(`/admin/authors/${id}`, author);
    return response.data;
  } catch (error) {
    console.error('Failed to update author', error);
    throw error;
  }
}

export const deleteAuthor = async (id: number) => {
  try {
    await axiosInstance.delete(`/admin/authors/${id}`);
  } catch (error) {
    console.error(`Failed to delete author with id ${id}`, error);
    throw error;
  }
}


