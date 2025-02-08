<template>
  <div class="homepage__hero">
    <div class="homepage__hero--categories">
      <el-scrollbar>
      <ul>
        <li v-for="category in homepageStore.categories" :key="category.id" class="homepage__hero--items no-text-decoration">
         <router-link to=""> {{ category.name }}</router-link>
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
        <button class="user-btn">View All</button>
      </div>
    </div>

    <div class="product-section__items">
      <div class="product-card" v-for="book in homepageStore.topBorrowedBooks" :key="book.id">
        <div class="product-card__image">
          <img :src="book.image_url" alt="Book Image" class="img">
          <div class="product-card__add-to-cart">
            <button @click="addToCart(book)">
              <img src="@/assets/img/User/card-icon-white.svg" alt="">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div class="product-card__actions">
          <img src="@/assets/img/User/wishlist-icon-2.svg" alt="">
          <img src="@/assets/img/User/eye-icon.svg" alt="">
        </div>
        <div class="product-card__info">
          <h3 class="product-card__title">{{ book.title }}</h3>
          <el-rate v-model="book.average_star" disabled></el-rate>
        </div>
      </div>
    </div>
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
          <router-link to="" class="category-card" v-for="(category, idx) in group" :key="category.id">
            <img :src="categoryImages[idx % categoryImages.length]" alt="Category image" class="category-image">
            <span>{{ category.name }}</span>
          </router-link>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>

  <!--  Banner  -->
  <img src="@/assets/img/User/homepage-banner.svg" alt="" class="homepage__banner">

  <!-- Benefits -->
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useHomepageStore } from '@/stores/User/homepage.store';

const homepageStore = useHomepageStore();
const categoriesPerPage = 6
const carouselRef = ref()

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

onMounted( () => {
  homepageStore.fetchCategories();
  homepageStore.fetchTopBorrowedBooks()
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

.product-section {
  margin-top: 70px;

  &__label {
    color: var(--user-theme-color);
    font-weight: 500;
  }

  &__title {
    font-size: 22px;
    font-weight: 600;
  }

  &__paginate {
    display: flex;
    gap: 8px;

    button {
      background-color: #F5F5F5;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 999px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: #E0E0E0;
        cursor: pointer;
      }
    }
  }

  &__items {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
    gap: 40px;
  }

  .product-card {
    flex: 25%;
    width: 310px;
    height: fit-content;
    background: #fff;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s;

    &:hover {
      cursor: pointer;
      color: var(--user-theme-color);
    }

    &__image {
      width: 100%;
      height: 267px;
      background-color: #F5F5F5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .img {
        width: 60%;
        height: 80%;
        object-fit: cover;
      }

      &:hover .product-card__add-to-cart {
        animation: slideUp 0.3s ease forwards;
      }
    }

    &__actions {
      display: flex;
      flex-direction: column;
      position: absolute;
      gap: 10px;
      top: 10px;
      right: 10px;

      img {
        width: 30px;

        &:hover {
          width: 27px;
          border: 1.5px solid #000;
          border-radius: 999px;
        }
      }
    }

    &__add-to-cart {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      opacity: 0;
      transform: translateY(20px);
      transition: transform 0.3s, opacity 0.3s;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: #ff723d;
        color: #fff;
        border: none;
        padding: 12px 10px;
        font-size: 14px;
        width: 100%;
        border-radius: 0 0 4px 4px;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
          background-color: #ff4500;
        }
      }
    }

    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__title {
      margin-top: 15px;
    }
  }

  &__category {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;

    .category-card {
      border: 1.5px solid #dedede;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      border-radius: 5px;
      width: 175px;
      height: 155px;
      transition: background 0.3s, color 0.3s;

      &:hover {
        background-color: var(--user-theme-color);
        color: #fff;
        .category-image {
          filter: grayscale(100%) invert(1) brightness(1000%);
        }
      }
    }
  }
}
</style>
