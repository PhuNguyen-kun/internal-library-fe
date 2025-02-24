import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import * as wishlistService from "@/services/User/wishlistService";
import {defaultPagination} from "@/constants/Admin/pagination";
import {notifyError, notifySuccess} from "@/composables/notifications";

export const useWishlistStore = defineStore("wishlist", () => {
  const wishlists = ref([]);
  const wishlist = ref(null);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  });

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchWishlists();
  }

  const fetchWishlists = async (filters = {}) => {
    try {
      const response = await wishlistService.getWishlists({
        per_page: pagination.per_page,
        page: pagination.current_page,
        ...filters
      });
      wishlists.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      console.log(wishlists.value);
    } catch (error) {
      console.error("Failed to fetch wishlists", error);
      throw error;
    }
  };

  const removeFromWishlist = async (bookId: number) => {
    try {
      const response = await wishlistService.removeFromWishlist(bookId);
      console.log("Sách đã được xóa khỏi danh sách yêu thích:", response);
      await fetchWishlists();
    } catch (error) {
      console.error("Failed to delete wishlist item", error);
      throw error;
    }
  }

  const addToWishlist = async (bookId: number) => {
    try {
      const response = await wishlistService.addToWishlist(bookId);
      console.log("Sách đã được thêm vào danh sách yêu thích:", response);
      notifySuccess("Thêm vào danh sách yêu thích thành công!");
      await fetchWishlists();
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      notifyError("Sách đã được thêm vào danh sách yêu thích!");
      throw error;
    }
  }

  return {
    wishlists,
    wishlist,
    pagination,
    handlePageChange,
    fetchWishlists,
    removeFromWishlist,
    addToWishlist
  };
});
