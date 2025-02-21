<template>
  <div class="page-wrapper" v-if="bookStore.book" :key="route.params.slug">
    <div>
      <TheBreadCrumb />
    </div>

    <div class="book-detail__container">
      <div class="book-detail__images">
        <div class="additional-images">
          <img
            v-for="image in bookStore.book.additional_images"
            :key="image.id"
            :src="image.url"
            alt="Additional Image"
            class="additional-image"
          />
        </div>
        <div>
          <img :src="bookStore.book.image_url" alt="" class="main-image">
        </div>
      </div>

      <div class="book-detail__info">
        <h1 class="book-detail__info--title">{{ bookStore.book.title }}</h1>
        <div class="book-detail__info--rate">
          <el-rate v-model="bookStore.book.average_star" disabled size="large" disabled-void-color="#E5E5E5"></el-rate>
          <div class="review-count">({{bookStore.book.review_count}} đánh giá)</div>
        </div>
        <p class="book-detail__info--short-desc">{{ bookStore.book.short_description }}</p>
        <div class="book-detail__info--function">
          <el-input-number class="custom-input-quantity function__quantity" v-model="num" :min="1" :max="10" @change="handleChange" />
          <button class="user-btn">Mượn ngay</button>
          <button class="wishlist-btn"><img src="@/assets/img/User/wishlist-icon.svg" alt=""></button>
        </div>
        <div class="book-detail__info--delivery">
          <div class="delivery-details">
            <img src="@/assets/img/User/delivery-icon-1.svg" alt="">
            <div class="delivery-details__content">
              <p class="delivery-details__title">Free Delivery</p>
              <p class="delivery-details__sub-title">Enter your postal code for Delivery Availability</p>
            </div>
          </div>
          <div class="separator"></div>
          <div class="delivery-details">
            <img src="@/assets/img/User/delivery-icon-2.svg" alt="">
            <div class="delivery-details__content">
              <p class="delivery-details__title">Return Delivery</p>
              <p class="delivery-details__sub-title">Free 30 Days Delivery Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  Description  -->
    <div class="book-detail__description">
      <div class="book-detail__description--heading">
        <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
        <span class="product-section__label">Mô tả chi tiết</span>
      </div>
      <div class="book-detail__description--content">{{ bookStore.book.description }}</div>
    </div>

    <!--  Review  -->
    <div class="book-detail__description">
      <div class="book-detail__description--heading">
        <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
        <span class="product-section__label">Đánh giá</span>
      </div>
      <div class="book-detail__description--review">
        <div v-for="review in bookStore.reviews" :key="review.id" class="container">
          <img src="@/assets/img/User/user-icon.svg" alt="">
          <div>
            <div class="name">{{ review.user.full_name }}</div>
            <el-rate v-model="review.star" disabled></el-rate>
            <div class="comment">{{ review.comment }}</div>
            <div class="date">{{ review.created_at }}</div>
          </div>
        </div>
      <div class="review-input">
        <p class="review-input__title">Bình luận và đánh giá của bạn</p>
        <el-rate v-model="bookStore.reviews.star" size="large" class="star"></el-rate>
        <el-input
          v-model="bookStore.reviews.comment"
          class="review-input__content"
          :rows="4"
          type="textarea"
          placeholder="Nhập bình luận của bạn"
        />
        <button class="user-btn">Gửi</button>
      </div>
      </div>
    </div>

    <!--  Related books  -->
    <div class="product-section">
      <div class="product-section__header">
        <div style="display: flex; align-items: center; gap: 10px">
          <img src="@/assets/img/User/orange-before.svg" alt="" style="width: 15px">
          <span class="product-section__label">Related books</span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 15px; justify-content: space-between">
          <h2 class="product-section__title">Các sản phẩm có liên quan</h2>
          <div class="product-section__paginate">
            <button @click="prevSlide"><el-icon size="large"><Back /></el-icon></button>
            <button @click="nextSlide"><el-icon size="large"><Right /></el-icon></button>
          </div>
        </div>
      </div>

      <el-carousel ref="carouselRef" arrow="never" class="">
        <el-carousel-item v-for="(group, index) in relatedBooksGroup" :key="index" class="no-text-decoration">
          <div class="product-section__category">
            <router-link :to="'/books/' + book.slug" class="product-card" v-for="book in group" :key="book.id">
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

<!--            <ProductList :books="bookStore.relatedBooks" />-->
          </div>
        </el-carousel-item>
      </el-carousel>

    </div>
  </div>
</template>

<script setup lang="ts">
import TheBreadCrumb from '@/components/User/Common/TheBreadCrumb.vue'
import { onMounted, ref, computed, watchEffect } from 'vue'
import { useBookStore} from "@/stores/User/book.store";
import { useRoute } from 'vue-router'
import ProductList from "@/components/User/Common/ProductList.vue";

const route = useRoute()
const bookStore = useBookStore()
const carouselRef = ref()
const booksPerSlide = 4
const relatedBooksGroup = computed(() => {
  const groups = []
  for (let i = 0; i < bookStore.relatedBooks.length; i += booksPerSlide) {
    groups.push(bookStore.relatedBooks.slice(i, i + booksPerSlide))
  }
  console.log('relatedBooksGroup:', groups)
  return groups
})

const prevSlide = () => {
  carouselRef.value?.prev()
}
const nextSlide = () => {
  carouselRef.value?.next()
}

watchEffect(async () => {
  const slug = route.params.slug as string;

  try {
    await bookStore.fetchBooks();
    const book = bookStore.books.find((b) => b.slug === slug);

    if (!book) {
      console.log("Fetching book by slug:", slug);
      await bookStore.fetchBookBySlug(slug);
      await bookStore.fetchReviews(slug);
      await bookStore.fetchRelatedBooks(slug);
    } else {
      await bookStore.fetchBook(book.id);
    }
  } catch (error) {
    console.error("Error fetching book:", error);
  }
});
</script>

<style scoped lang="scss">
:deep(.custom-input-quantity) {
  .el-input__wrapper {
    box-shadow: none !important;
    border: 1px solid #ccc;
  }
}

.book-detail {
  &__container {
    display: flex;
    align-items: center;
    margin-top: 50px;
    height: 100%;
  }
  &__images {
    display: flex;

    .additional-images {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .additional-image {
      width: 100px;
      height: 110px;
      object-fit: fill;
      padding: 15px 30px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }

    .main-image {
      width: 400px;
      height: 542px;
      margin: 0 60px 0 30px;
      padding: 32px 60px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
  }

  &__info {
    flex: 1;
    height: 600px;

    &--title {
      font-size: 24px;
      font-weight: 600;
   }

    &--rate {
      margin: 10px 0 20px 0;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      font-weight: 500;
      color: #858585;

      .review-count {
        margin-top: 2px;
      }
    }

    &--short-desc {
      line-height: 24px;
      border-bottom: 1px solid #000;
      padding-bottom: 30px;
    }

    &--function {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;

      .user-btn {
        width: 190px;
        justify-content: center;
      }

      .wishlist-btn {
        border-radius: 5px;
        border: 1px solid #969696;
        display: flex;
        align-items: center;
        padding: 8.5px;
        background-color: #fff;
        cursor: pointer;

        &:hover {
          background-color: var(--user-theme-color);
          border-color: #fff;
          img {
            filter: invert(1);
          }
        }
      }

      &__quantity {
        width: 100px;
      }
    }

    &--delivery {
      display: flex;
      flex-direction: column;
      margin-top: 50px;
      border: 1px solid #969696;
      border-radius: 5px;

      .separator {
        width: 100%;
        height: 0.5px;
        background-color: #969696;
      }

      .delivery-details {
        display: flex;
        gap: 10px;
        padding: 20px;

        &__content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        img {
          width: 50px;
          height: 50px;
        }

        &__title {
          font-size: 16px;
          font-weight: 600;
        }

        &__sub-title {
          font-size: 14px;
        }
      }
    }
  }

  &__description {
    margin-top: 50px;
    &--heading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--user-theme-color);
      font-weight: 500;
    }

    &--content {
      margin-top: 20px;
      line-height: 24px;
      //padding: 20px;
      //box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      //border: 1px solid #ccc;
      //border-radius: 5px;
    }

    &--review {
      border: 1px solid #ccc;
      //box shadow for medium shadow
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      margin-top: 20px;

      .review-input {
        padding: 30px 20px;

        &__title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
        }
        &__content {
          width: 100%;
          margin-top: 10px;
        }
        .user-btn {
          margin-top: 15px;
        }
      }

      .container {
        border-radius: 5px;
        margin-top: 10px;
        display: flex;
        gap: 15px;
        padding: 23px 20px;
      }

      .container:last-of-type {
        border-bottom: 1px solid #ccc;
      }

      img {
        width: 30px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 999px;
        padding: 2px;
        background-color: #f3f3f3;
      }

      .name {
        font-weight: 600;
      }

      .comment {
        line-height: 24px;
        margin-top: 5px;
      }

      .date {
        font-size: 13px;
        color: #858585;
        margin-top: 10px;
      }
    }
  }
}

:deep(.el-input-number__decrease) {
  background-color: #fff;

  .el-icon {
    color: var(--user-theme-color);
  }
}

:deep(.el-input-number__increase) {
  background-color: #fff;

  .el-icon {
    color: var(--user-theme-color);
  }
}

:deep(.el-input) {
  height: 40px;
}

:deep(.el-carousel__container) {
  height: 370px;
}
</style>

<style lang="scss">
.el-input-number__decrease:hover, .el-input-number__increase:hover {
  background-color: var(--user-theme-color);
  .el-icon {
    color: #fff;
  }
}
</style>
