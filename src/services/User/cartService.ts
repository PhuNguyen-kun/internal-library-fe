import axiosInstance from "@/utils/axiosInstance";

export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/user/cart");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart", error);
    throw error;
  }
};

export const getCartItem = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.get(`/user/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart item", error);
    throw error;
  }
};

export const addToCart = async (bookId: number, quantity: number = 1) => {
  try {
    const response = await axiosInstance.post("/user/cart", { book_id: bookId, quantity });
    return response.data;
  } catch (error) {
    console.error("Failed to add book to cart", error);
    throw error;
  }
};

export const updateCart = async (cartUpdates: any) => {
  try {
    const response = await axiosInstance.put("/user/cart", { items: cartUpdates });
    return response.data;
  } catch (error) {
    console.error("Failed to update cart", error);
    throw error;
  }
};

export const removeCartItem = async (cartItemId: number) => {
  try {
    const response = await axiosInstance.delete(`/user/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to remove book from cart", error);
    throw error;
  }
};

export const checkoutCart = async (orderData: any) => {
  try {
    const response = await axiosInstance.post("/admin/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to checkout cart", error);
    throw error;
  }
};
