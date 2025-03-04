import { defineStore } from "pinia";
import { ref } from 'vue';
import * as dashboardService from "@/services/Admin/dashboardService";
import {handleError} from "@/utils/Admin/handleError";

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const topBorrowers = ref([]);
  const topBorrowedBooks = ref([]);
  const borrowedBooksByMonth = ref([]);
  const borrowedBooksByMonthLabels = ref([]);
  const booksByCategory = ref([]);
  const mostFavoriteBooks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTopBorrowers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardService.fetchTopBorrowers();
      topBorrowers.value = response.data;
    } catch (error) {
      handleError(error, 'Không thể lấy thông tin người mượn hàng đầu');
    } finally {
      loading.value = false;
    }
  };

  const fetchTopBorrowedBooks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardService.fetchTopBorrowedBooks();
      topBorrowedBooks.value = response.data;
    } catch (error) {
      handleError(error, 'Không thể lấy thông tin sách mượn nhiều nhất');
    } finally {
      loading.value = false;
    }
  };

  const fetchBorrowedBooksByMonth = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardService.fetchBorrowedBooksByMonth();
      borrowedBooksByMonth.value = response.data;
      borrowedBooksByMonthLabels.value = borrowedBooksByMonth.value.map((item) => item.month_year);
    } catch (error) {
      handleError(error, 'Cannot fetch borrowed books by month');
    } finally {
      loading.value = false;
    }
  };

  const fetchBooksByCategory = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardService.fetchBooksByCategory();
      booksByCategory.value = response.data;
    } catch (error) {
      handleError(error, 'Không thể lấy thông tin sách theo thể loại');
    } finally {
      loading.value = false;
    }
  };

  const fetchMostFavoriteBooks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardService.fetchMostFavoriteBooks();
      mostFavoriteBooks.value = response.data;
    } catch (error) {
      handleError(error, 'Không thể lấy thông tin sách được yêu thích nhất');
    } finally {
      loading.value = false;
    }
  }

  return {
    topBorrowers,
    topBorrowedBooks,
    borrowedBooksByMonth,
    booksByCategory,
    mostFavoriteBooks,
    borrowedBooksByMonthLabels,
    loading,
    error,
    fetchTopBorrowers,
    fetchTopBorrowedBooks,
    fetchBorrowedBooksByMonth,
    fetchBooksByCategory,
    fetchMostFavoriteBooks
  };
});
