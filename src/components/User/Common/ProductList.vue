<template>
  <div class="product-section__items">
    <router-link :to="'/books/' + book.slug" class="product-card" v-for="book in books" :key="book.id">
      <div class="product-card__image">
        <img :src="book.image_url" alt="Book Image" class="img">
        <div class="product-card__add-to-cart">
          <button @click.prevent.stop="addToCart(book)">
            <img src="@/assets/img/User/card-icon-white.svg" alt="">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div class="product-card__actions">
        <div class="action-buttons"><img src="@/assets/img/User/wishlist-icon.svg" alt=""></div>
        <div class="action-buttons"><img src="@/assets/img/User/eye-icon.svg" alt=""></div>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__info--title no-text-decoration">{{ book.title }}</h3>
        <div class="product-card__info--review">
          <el-rate v-model="book.average_star" disabled disabled-void-color="#E5E5E5"></el-rate>
          <div class="review-count">({{book.review_count}})</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
import {useCartStore} from "@/stores/User/cart.store";
import {notifySuccess} from "@/composables/notifications";

const cartStore = useCartStore();

defineProps({
  books: { type: Array as PropType<any[]>, required: true },
});

const addToCart = async (book: any) => {
  console.log('Book id:', book.id);
  await cartStore.addToCart(book.id);
  notifySuccess('Thêm vào giỏ hàng thành công');
};
</script>

<style scoped lang="scss">
</style>

