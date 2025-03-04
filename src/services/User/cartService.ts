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

export const checkStock = async (bookId: number, quantity: number) => {
  try {
    const response = await axiosInstance.get(`/user/books/${bookId}`);
    const stockQuantity = response.data.data.stock_quantity;
    console.log("Stock quantity:", stockQuantity);
    return stockQuantity >= quantity;
  } catch (error) {
    console.error("Failed to check stock", error);
    throw error;
  }
};

// cartService.ts
export const checkStocks = async (
  items: { bookId: number; quantity: number }[]
): Promise<boolean> => {
  try {
    // Gọi API kiểm tra stock cho nhiều sách
    const promises = items.map(async (item) => {
      const response = await axiosInstance.get(`/user/books/${item.bookId}`);
      return response.data.data.stock_quantity >= item.quantity;
    });

    // Kiểm tra tất cả kết quả
    const results = await Promise.all(promises);
    return results.every((isAvailable) => isAvailable);
  } catch (error) {
    console.error("Failed to check stock", error);
    throw error;
  }
};
