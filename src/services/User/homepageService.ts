import axiosInstance from "@/utils/axiosInstance";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/user/homepage/categories", {
      params: { per_page: 100 },
    });
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error('Failed to fetch categories', error);
    throw error;
  }
};

export const getTopBorrowedBooks = async () => {
  try {
    const response = await axiosInstance.get("/user/homepage/top-borrowed-books");
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error('Failed to fetch top borrowed books', error);
    throw error;
  }
}
