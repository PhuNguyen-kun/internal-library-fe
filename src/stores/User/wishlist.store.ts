import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import * as wishlistService from "@/services/User/wishlistService";
import {defaultPagination} from "@/constants/Admin/pagination";
import {
  message,
  messageError,
  messageSuccess,
  notifyError,
  notifyInfo,
  notifySuccess
} from "@/composables/notifications";
import {useAuthStore} from "@/stores/User/auth.store";


export const useWishlistStore = defineStore("wishlist", () => {
  const wishlists = ref([]);
  const wishlist = ref(null);
  const authStore = useAuthStore();
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  });
  const isInWishlist = (bookId: number): boolean => {
    return wishlists.value.some((item: any) => item.book?.id === bookId);
  };

  const checkAuth = () => {
    if (!authStore.isLoggedIn) {
      notifyInfo("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }
    return true;
  };

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchWishlists();
  }

  const toggleWishlist = async (bookId: number) => {
    try {
      if (isInWishlist(bookId)) {
        await removeFromWishlist(bookId);
        message("Đã xóa khỏi danh sách yêu thích!");
      } else {
        await addToWishlist(bookId);
        // messageSuccess("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchWishlists = async (filters = {}) => {
    try {
      const response = await wishlistService.getWishlists({
        per_page: pagination.per_page,
        page: pagination.current_page,
        ...filters
      });
      console.log("Wishlist response:", response.data);
      wishlists.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
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
    if (!checkAuth()) return false;

    try {
      const response = await wishlistService.addToWishlist(bookId);
      console.log("Sách đã được thêm vào danh sách yêu thích:", response);
      // notifySuccess("Thêm vào danh sách yêu thích thành công!");
      messageSuccess("Đã thêm vào danh sách yêu thích!");
      await fetchWishlists();
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      throw error;
    }
  }

  return {
    wishlists,
    wishlist,
    pagination,
    isInWishlist,
    toggleWishlist,
    handlePageChange,
    fetchWishlists,
    removeFromWishlist,
    addToWishlist
  };
});
