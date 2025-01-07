import axiosInstance from "@/utils/axiosInstance";
import type {Order} from "@/types/Admin/order";

export const fetchOrders = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get('/admin/orders', {
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

export const fetchOrderWithDetails = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/admin/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order with details', error);
    throw error;
  }
}

export const createOrder = async (order: Order) => {
  try {
    const response = await axiosInstance.post("/admin/orders", order);
    return response.data;
  } catch (error) {
    console.error('Failed to create author', error);
    throw error;
  }
}

export const updateOrder = async (id: number, order: Order) => {
  try {
    const payload = {
      status: order.status,
      details: order.details?.map((detail) => ({
        id: detail.id,
        status: detail.status,
        return_date_real: detail.return_date_real,
      })),
    };

    const response = await axiosInstance.put(`/admin/orders/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to update order', error);
    throw error;
  }
};

export const deleteOrder = async (id: number) => {
  try {
    await axiosInstance.delete(`/admin/orders/${id}`);
  } catch (error) {
    console.error(`Failed to delete order with id ${id}`, error);
    throw error;
  }
}


