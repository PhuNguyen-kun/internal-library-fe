import axiosInstance from "@/utils/axiosInstance";

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(`/user/info`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info', error);
    throw error;
  }
}

export const getProvinces = async () => {
  try {
    const response = await axiosInstance.get(`/user/location/provinces`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch provinces', error);
    throw error;
  }
}

export const getDistricts = async (provinceId: number) => {
  try {
    const response = await axiosInstance.get(`/user/location/districts?provinceId=${provinceId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch districts', error);
    throw error;
  }
}

export const getWards = async (districtId: number) => {
  try {
    const response = await axiosInstance.get(`/user/location/wards?districtId=${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch wards', error);
    throw error;
  }
}

export const updateUserInfo = async (userData: any) => {
  try {
    const response = await axiosInstance.put(`/user/info`, userData);
    return response.data;
  } catch (error) {
    console.error("Failed to update user info", error);
    throw error;
  }
};

export const updatePassword = async (passwordData: any) => {
  try {
    const response = await axiosInstance.put(`/user/info/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error("Failed to update password", error);
    throw error;
  }
};
