import axiosInstance from "@/utils/axiosInstance";

export const getWishlists = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/user/wishlist", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wishlists", error);
    throw error;
  }
}

export const removeFromWishlist = async (bookId: number) => {
  try {
    const response = await axiosInstance.delete(`/user/wishlist/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete wishlist item", error);
    throw error;
  }
};

export const addToWishlist = async (bookId: number) => {
  try {
    const response = await axiosInstance.post(`/user/wishlist/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to add to wishlist", error);
    throw error;
  }
}
