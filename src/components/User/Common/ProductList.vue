<template>
  <div class="product-section__items">
    <router-link :to="'/books/' + book.slug" class="product-card" v-for="book in books" :key="book.id" :ref="el => cardRefs[book.id] = el"
    >
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
        <div
          class="action-buttons"
          :class="{ 'active': wishlistStore.isInWishlist(book.id) }"
          @click.prevent.stop="handleWishlistClick(book.id, $event)"
        >
          <img src="@/assets/img/User/wishlist-icon.svg" alt="">
        </div>
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
import { defineProps, type PropType, ref } from 'vue';
import {useCartStore} from "@/stores/User/cart.store";
import {useWishlistStore} from "@/stores/User/wishlist.store";

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const cardRefs = ref<Record<number, HTMLElement>>({});
const handleWishlistClick = async (bookId: number, event: MouseEvent) => {
  const isCurrentlyInWishlist = wishlistStore.isInWishlist(bookId);

  if (!isCurrentlyInWishlist) {
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    // Tính toán chính xác vị trí wishlist icon
    const wishlistIcon = document.querySelector('.header__action--icon [href="/wishlist"]');
    if (wishlistIcon) {
      const iconRect = wishlistIcon.getBoundingClientRect();
      const endX = iconRect.left + iconRect.width / 2;
      const endY = iconRect.top + iconRect.height / 2;

      createFlyingHeart(startX, startY, endX, endY);
    }
  }

  await wishlistStore.toggleWishlist(bookId);
};

const createFlyingHeart = (startX: number, startY: number, endX: number, endY: number) => {
  const flyingHeart = document.createElement('div');
  flyingHeart.classList.add('flying-heart');
  flyingHeart.innerHTML = '❤️';

  Object.assign(flyingHeart.style, {
    left: `${startX}px`,
    top: `${startY}px`,
    position: 'fixed',
    fontSize: '24px',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: '1',
    pointerEvents: 'none',
    zIndex: '9999'
  });

  document.body.appendChild(flyingHeart);

  requestAnimationFrame(() => {
    Object.assign(flyingHeart.style, {
      transform: `translate(${endX - startX}px, ${endY - startY}px)`,
      opacity: '0',
      scale: '0.5'
    });
  });

  setTimeout(() => {
    flyingHeart.remove();
  }, 800);
};

defineProps({
  books: { type: Array as PropType<any[]>, required: true },
});

const addToCart = async (book: any) => {
  console.log('Book id:', book.id);
  await cartStore.addToCart(book.id);
};
</script>

<style scoped lang="scss">
.action-buttons {
  width: 7px;
  height: 14px;
  border-radius: 999px;
  justify-content: center;
  border: none;

  img {
    width: 20px;
  }

  &:hover {
    background-color: var(--user-theme-color);

    img {
      filter: invert(1);
    }
  }

  &.active {
    background-color: var(--user-theme-color);

    img {
      filter: invert(1);
    }
  }
}
</style>

