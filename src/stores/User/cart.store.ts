import { defineStore } from "pinia";
import { ref } from "vue";
import * as cartService from "@/services/User/cartService";
import {handleError} from "@/utils/Admin/handleError";
import {notifySuccess} from "@/composables/notifications";

export const useCartStore = defineStore("cart", () => {
  const cart = ref([]);
  const cartItem = ref(null);
  const loading = ref(false);

  // const cartTotal = computed(() => {
  //   return cart.value.reduce((acc, item) => acc + item.quantity, 0);
  // });

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
    try {
      const response = await cartService.addToCart(bookId, quantity);
      console.log("Sách đã được thêm vào giỏ hàng:", response);
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

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
      const response = await cartService.checkoutCart(orderData);
      console.log("Thanh toán giỏ hàng thành công:", response);
      cart.value = [];
    } catch (error) {
      console.error("Failed to checkout cart", error);
    }
  };

  return {
    cart,
    cartItem,
    loading,
    fetchCart,
    fetchCartItem,
    addToCart,
    updateCart,
    removeCartItem,
    checkoutCart,
  };
});
