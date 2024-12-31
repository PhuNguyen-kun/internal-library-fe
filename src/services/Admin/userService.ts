import axiosInstance from "@/utils/axiosInstance";
import type { User } from '@/types/Admin/user';

export const getUsers = async (searchTerm: string = '', perPage: number, page: number) => {
  try {
    const response = await axiosInstance.get("/admin/users", {
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
    console.error('Failed to fetch users', error);
    throw error;
  }
}

export const createUser = async (user: User) => {
  try {
    const response = await axiosInstance.post("/admin/users", user);
    return response.data;
  } catch (error) {
    console.error('Failed to create user', error);
    throw error;
  }
}

export const updateUser = async (id: number, user: User) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
}

// export const deleteUser = async (id: number) => {
//   try {
//     await axiosInstance.delete(`/admin/users/${id}`);
//   } catch (error) {
//     console.error(`Failed to delete user with id ${id}`, error);
//     throw error;
//   }
// }


