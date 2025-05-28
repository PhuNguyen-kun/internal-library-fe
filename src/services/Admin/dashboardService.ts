import axiosInstance from "@/utils/axiosInstance";

export const fetchTopBorrowers = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/top-borrowers');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchTopBorrowedBooks = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/top-borrowed-books');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchBorrowedBooksByMonth = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/borrowed-books-by-month');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchBooksByCategory = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/books-by-category');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchMostFavoriteBooks = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/most-favorite-books');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
