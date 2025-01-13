import axiosInstance from "@/utils/axiosInstance";
import type { Review } from '@/types/Admin/review';

export const getReviews = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get("/admin/reviews", {
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
    console.error('Failed to fetch reviews', error);
    throw error;
  }
}

export const createReview = async (review: Review) => {
  try {
    const response = await axiosInstance.post("/admin/reviews", review);
    return response.data;
  } catch (error) {
    console.error('Failed to create review', error);
    throw error;
  }
}

export const updateReview = async (id: number, payload: { id: number; status: string }) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to update review', error);
    throw error;
  }
}
