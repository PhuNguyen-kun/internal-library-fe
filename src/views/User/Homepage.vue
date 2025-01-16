<template>
  <div class="homepage__hero">
    <div class="homepage__hero--categories">
      <ul>
        <li v-for="category in homepageStore.categories" :key="category.id" class="homepage__hero--items no-text-decoration">
         <router-link to=""> {{ category.name }}</router-link>
        </li>
      </ul>
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
        </div>
        <div class="product-card__info">
          <h3 class="product-card__title">{{ book.title}}</h3>
          <el-rate v-model="book.average_star" disabled></el-rate>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHomepageStore } from '@/stores/User/homepage.store';

const homepageStore = useHomepageStore();

const carouselImages = [
  "/kiai-carousel-5.jpg",
  "/kiai-carousel-4.jpg",
  "/kiai-carousel-3.jpg",
  "/kiai-carousel-2.jpg",
  "/kiai-carousel-1.jpg",
]

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
      display: flex;
      align-items: center;
      border-right: 1px solid #ddd;
    }
    &--items {
      padding: 9px 110px 9px 0;
    }

    &--items:first-child {
      margin-top: 30px;
    }
    &--carousel {
      width: 80%;
      margin-top: 30px;

      .carousel-image {
        height: 344px;
        width: 100%;
        object-fit: cover;
      }
    }
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

  &__items {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
  }

  .product-card {
    flex: 1 1 calc(25% - 20px);
    max-width: 320px;
    min-width: 200px;
    background: #fff;
    border-radius: 4px;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }

    &__image {
      width: 100%;
      height: 100%;
      background-color: #F5F5F5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 60%;
        height: 80%;
        object-fit: cover;
      }
    }

    &__title {
      margin-top: 15px;
    }
  }
}
</style>
