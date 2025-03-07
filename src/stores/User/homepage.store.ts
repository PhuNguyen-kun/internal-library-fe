import { defineStore } from 'pinia';
import * as homepageService from '@/services/User/homepageService';
import { ref } from 'vue';

export const useHomepageStore = defineStore('homepage', () => {
  const categories = ref([]);
  const fetchCategories = async () => {
    try {
      const response = await homepageService.getCategories();
      categories.value = response.data;
      console.log("Category:", categories.value);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      throw error;
    }
  };

  return {
    categories,
    fetchCategories,
  };
});
