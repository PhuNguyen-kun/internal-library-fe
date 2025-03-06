<template>
  <div class="homepage__hero">
    <div class="homepage__hero--categories">
      <el-scrollbar>
      <ul class="category-sidebar">
        <li v-for="category in homepageStore.categories" :key="category.id" class="homepage__hero--items no-text-decoration">
         <router-link :to="'books?category=' + category.slug"> {{ category.name }}</router-link>
        </li>
      </ul>
      </el-scrollbar>
    </div>

    <div class="homepage__hero--carousel">
      <el-carousel height="344px" motion-blur>
        <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
          <img :src="image" alt="Carousel Image" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <div class="product-section">
    <div class="product-section__header">
      <div style="display: flex; align-items: center; gap: 10px">
        <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
        <span class="product-section__label">Sách hot</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 15px; justify-content: space-between">
        <h2 class="product-section__title">Top các sách được mượn nhiều nhất</h2>
        <router-link to="/books?sort=most_borrowed" class="user-btn">Xem tất cả</router-link>
      </div>
    </div>

    <ProductList :books="bookStore.topBorrowedBooks" />
  </div>

  <!-- Category row -->
  <div class="product-section">
    <div class="product-section__header">
      <div style="display: flex; align-items: center; gap: 10px">
        <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
        <span class="product-section__label">Categories</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 15px; justify-content: space-between">
        <h2 class="product-section__title">Các danh mục sách</h2>
        <div class="product-section__paginate">
          <button @click="prevSlide"><el-icon size="large"><Back /></el-icon></button>
          <button @click="nextSlide"><el-icon size="large"><Right /></el-icon></button>
        </div>
      </div>
    </div>

    <el-carousel ref="carouselRef" arrow="never">
      <el-carousel-item v-for="(group, index) in categoryGroups" :key="index" class="no-text-decoration">
        <div class="product-section__category">
          <router-link :to="'/books?category=' + category.slug" class="category-card" v-for="(category, idx) in group" :key="category.id">
            <img :src="categoryImages[idx % categoryImages.length]" alt="Category image" class="category-image">
            <span>{{ category.name }}</span>
          </router-link>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>

  <!--  Banner  -->
  <img src="@/assets/img/User/homepage-banner.svg" alt="" class="homepage__banner">

  <!-- All books -->
  <div class="product-section">
    <div class="product-section__header">
      <div style="display: flex; align-items: center; gap: 10px">
        <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
        <span class="product-section__label">All products</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 15px; justify-content: space-between">
        <h2 class="product-section__title">Khám phá tất cả sản phẩm</h2>
        <router-link :to="'/books'" class="user-btn">Xem tất cả</router-link>
      </div>
    </div>

      <div class="product-section__items">
        <router-link :to="'/books/' + book.slug" class="product-card" v-for="book in firstRows" :key="book.id">
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
            <div class="action-buttons" :class="{ 'active': wishlistStore.isInWishlist(book.id) }" @click.prevent.stop="handleWishlistClick(book.id, $event)">
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
    <div class="product-section__items">
      <router-link :to="'/books/' + book.slug" class="product-card" v-for="book in secondRows" :key="book.id">
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
          <div class="action-buttons" :class="{ 'active': wishlistStore.isInWishlist(book.id) }" @click.prevent.stop="handleWishlistClick(book.id, $event)"
          ><img src="@/assets/img/User/wishlist-icon.svg" alt=""></div>
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
  </div>

  <!-- Benefits -->
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useHomepageStore } from '@/stores/User/homepage.store';
import { useBookStore} from "@/stores/User/book.store";
import ProductList from "@/components/User/Common/ProductList.vue";
import {notifySuccess} from "@/composables/notifications";
import {useCartStore} from "@/stores/User/cart.store";
import {useWishlistStore} from "@/stores/User/wishlist.store";

const homepageStore = useHomepageStore();
const cartStore = useCartStore();
const bookStore = useBookStore();
const wishlistStore = useWishlistStore();
const categoriesPerPage = 6
const carouselRef = ref()
const first8Books = computed(() => bookStore.books.slice(0, 8))
const firstRows = computed(() => first8Books.value.slice(0, 4))
const secondRows = computed(() => first8Books.value.slice(4, 8))

const carouselImages = [
  "/kiai-carousel-5.jpg",
  "/kiai-carousel-4.jpg",
  "/kiai-carousel-3.jpg",
  "/kiai-carousel-2.jpg",
  "/kiai-carousel-1.jpg",
]

const categoryImages = [
  "/category-icon-1.svg",
  "/category-icon-2.svg",
  "/category-icon-3.svg",
  "/category-icon-4.svg",
  "/category-icon-5.svg",
]

const categoryGroups = computed(() => {
  const groups = []
  for (let i = 0; i < homepageStore.categories.length; i += categoriesPerPage) {
    groups.push(homepageStore.categories.slice(i, i + categoriesPerPage))
  }
  return groups
})

const prevSlide = () => {
  carouselRef.value?.prev()
}
const nextSlide = () => {
  carouselRef.value?.next()
}

const addToCart = async (book: any) => {
  console.log('Book id:', book.id);
  await cartStore.addToCart(book.id);
};

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

onMounted( () => {
  homepageStore.fetchCategories();
  bookStore.fetchTopBorrowedBooks();
  bookStore.fetchBooks()
});
</script>

<style scoped lang="scss">
.homepage {
  &__hero {
    display: flex;
    justify-content: space-between;

    &--categories {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid #ddd;
      height: 380px;
    }

    &--items {
      padding: 9px 50px 9px 0;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
    }

    &--items:first-child {
      margin-top: 10px;
    }

    &--carousel {
      width: 78%;
      margin-top: 30px;
      margin-left: 50px;

      .carousel-image {
        height: 344px;
        width: 100%;
        object-fit: cover;
      }
    }
  }

  &__banner {
    width: 100%;
  }
}

:deep(.el-carousel__container) {
  height: 270px;
  margin-top: 5px;
}

ol, ul {
   list-style: none;
}

.category-sidebar {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
