import { defineStore } from "pinia";
import { ref } from "vue";
import * as cartService from "@/services/User/cartService";
import * as bookService from "@/services/User/bookService";
import {handleError} from "@/utils/Admin/handleError";
import {notifyError, notifyInfo, notifySuccess} from "@/composables/notifications";
import type {CartItem} from "@/types/User/cart";
import {useAuthStore} from "@/stores/User/auth.store";

export const useCartStore = defineStore("cart", () => {
  const cart = ref<CartItem[]>([]);
  const cartItem = ref(null);
  const loading = ref(false);
  const outOfStockItems = ref<number[]>([]);
  const authStore = useAuthStore();

  const checkAuth = () => {
    if (!authStore.isLoggedIn) {
      notifyInfo("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }
    return true;
  };

  const fetchCart = async () => {
    try {
      loading.value = true;
      const response = await cartService.getCart();
      cart.value = response.data;
      console.log("Giỏ hàng hiện tại:", cart.value);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      loading.value = false;
    }
  };

  const fetchCartItem = async (cartItemId: number) => {
    try {
      loading.value = true;
      const response = await cartService.getCartItem(cartItemId);
      cartItem.value = response.data;
      console.log("Chi tiết giỏ hàng:", cartItem.value);
    } catch (error) {
      console.error("Failed to fetch cart item", error);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (bookId: number, quantity: number = 1) => {
    if (!checkAuth()) return false;

    try {
      await fetchCart();

      const existingItem = cart.value.find((item) => item.book.id === bookId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalQuantity = currentQuantity + quantity;

      const isStockAvailable = await cartService.checkStock(bookId, totalQuantity);
      if (!isStockAvailable) {
        notifyError("Số lượng tồn kho không đủ");
        return false;
      }
      if (totalQuantity > 5) {
        notifyError("Bạn chỉ được mượn tối đa 5 quyển cho 1 sách!");
        return false;
      }
      const response = await cartService.addToCart(bookId, quantity);
      notifySuccess("Sách đã được thêm vào giỏ hàng!");
      console.log("Sách đã được thêm vào giỏ hàng:", response);
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const addAllToCart = async (books: { id: number, quantity?: number }[]) => {
    if (!checkAuth()) return false;

    try {
      let successCount = 0;
      let failCount = 0;

      for (const book of books) {
        const bookId = book.id;
        const quantity = book.quantity || 1;

        // Check current cart to get existing quantity
        const existingItem = cart.value.find((item) => item.book.id === bookId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentQuantity + quantity;

        // Validate stock and quantity limits
        const isStockAvailable = await cartService.checkStock(bookId, totalQuantity);
        if (!isStockAvailable || totalQuantity > 5) {
          failCount++;
          continue; // Skip this book but continue with others
        }

        // Add to cart without notification
        await cartService.addToCart(bookId, quantity);
        successCount++;
      }

      // Refresh cart after adding all items
      await fetchCart();

      // Show appropriate notification based on results
      if (successCount > 0) {
        notifySuccess(`Đã thêm ${successCount} sách vào giỏ hàng!`);
      }
      if (failCount > 0) {
        notifyInfo(`${failCount} sách không thể thêm do số lượng tồn kho không đủ hoặc vượt quá giới hạn.`);
      }

      return successCount > 0;
    } catch (error) {
      console.error("Failed to add all to cart", error);
      return false;
    }
  }
  const updateCart = async (cartUpdates: any) => {
    try {
      const response = await cartService.updateCart(cartUpdates);
      console.log("Giỏ hàng đã được cập nhật:", response);

      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng", error);
      handleError(error, "updating cart");
    }
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      const response = await cartService.removeCartItem(cartItemId);
      console.log("Sách đã được xóa khỏi giỏ hàng:", response);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove cart item", error);
    }
  };

  const checkoutCart = async (orderData: any) => {
    try {
      const itemsToCheck = orderData.items.map((item: any) => ({
        bookId: item.book_id,
        quantity: item.quantity,
      }));

      const isStockAvailable = await cartService.checkStocks(itemsToCheck);
      if (!isStockAvailable) {
        notifyError("Một số sản phẩm đã hết hàng! Vui lòng quay trở lại giỏ hàng!");
        throw new Error("Một số sản phẩm đã hết hàng!");
      }

      const response = await cartService.checkoutCart(orderData);
      cart.value = [];
      return response.data;
    } catch (error) {
      console.error("Lỗi khi checkout:", error);
      throw error;
    }
  };

  const checkStocks = async (items: { bookId: number; quantity: number }[]) => {
    try {
      const results = await Promise.all(
        items.map(async (item) => {
          const isAvailable = await cartService.checkStock(item.bookId, item.quantity);
          return { bookId: item.bookId, isAvailable };
        })
      );

      outOfStockItems.value = results
        .filter(result => !result.isAvailable)
        .map(result => result.bookId);

      return outOfStockItems.value.length === 0;
    } catch (error) {
      console.error("Lỗi khi kiểm tra stock:", error);
      return false;
    }
  };

  return {
    cart,
    cartItem,
    loading,
    outOfStockItems,
    fetchCart,
    fetchCartItem,
    addToCart,
    updateCart,
    removeCartItem,
    checkoutCart,
    checkStocks,
    addAllToCart,
  };
});
