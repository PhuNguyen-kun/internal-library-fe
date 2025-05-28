import axiosInstance from "@/utils/axiosInstance";
import type { Review } from '@/types/Admin/review';

export const getReviews = async (params: {
  search_term?: string;
  stars?: number[];
  status?: number[];
  page?: number;
  per_page?: number;
}) => {
  try {
    const processedParams = {
      ...params,
      stars: params.stars?.join(','),
      status: params.status?.join(','),
    };

    const response = await axiosInstance.get("/admin/reviews", {
      params: processedParams
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination
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

export const updateReview = async (id: number, payload: { id: number; status: any }) => {
  try {
    const response = await axiosInstance.put(`/admin/reviews/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to update review', error);
    throw error;
  }
}
