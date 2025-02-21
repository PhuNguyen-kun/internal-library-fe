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
