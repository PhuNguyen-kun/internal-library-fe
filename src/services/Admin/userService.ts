import axiosInstance from "@/utils/axiosInstance";
import type { User } from '@/types/Admin/user';

export const getUsers = async (params: {
  search_term?: string;
  status?: number[];
  page?: number;
  per_page?: number;
}) => {
  try {
    const response = await axiosInstance.get("/admin/users", {
      params,
      paramsSerializer: (params) => {
        const query = new URLSearchParams();
        for (const key in params) {
          const value = params[key];
          if (Array.isArray(value)) {
            query.append(key, value.join(','));
          } else if (value !== undefined && value !== null) {
            query.append(key, String(value));
          }
        }
        return query.toString();
      }
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

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


