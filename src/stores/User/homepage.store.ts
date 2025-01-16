import { defineStore } from 'pinia';
import * as homepageService from '@/services/User/homepageService';
import { ref } from 'vue';

export const useHomepageStore = defineStore('homepage', () => {
  const categories = ref([]);
  const topBorrowedBooks = ref([]);
  const fetchCategories = async () => {
    try {
      const response = await homepageService.getCategories();
      categories.value = response.data;
      console.log(categories.value);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      throw error;
    }
  };

  const fetchTopBorrowedBooks = async () => {
    try {
      const response = await homepageService.getTopBorrowedBooks();
      topBorrowedBooks.value = response.data.slice(0, 4);
      console.log(topBorrowedBooks.value);
    } catch (error) {
      console.error('Failed to fetch top borrowed books', error);
      throw error;
    }
  }

  return {
    categories,
    topBorrowedBooks,
    fetchCategories,
    fetchTopBorrowedBooks
  };
});
