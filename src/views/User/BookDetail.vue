<template>
  <div v-if="bookStore.book" :key="route.params.slug" class="page-wrapper">
    <div>
      <TheBreadCrumb/>
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
            @click="changeMainImage(image.url)"
          />
        </div>
        <div>
          <el-skeleton :loading="loading" animated class="main-image">
            <template #template>
              <el-skeleton-item style="width: 100%; height: 100%;" variant="image"/>
            </template>

            <template #default>
              <div>
                <img :src="mainImage" alt="" class="main-image"/>
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>

      <div class="book-detail__info">
        <h1 class="book-detail__info--title">{{ bookStore.book.title }}</h1>
        <div class="book-detail__info--rate">
          <el-rate v-model="bookStore.book.average_star" disabled disabled-void-color="#E5E5E5" size="large"></el-rate>
          <div class="review-count">({{ bookStore.book.review_count }} đánh giá)</div>
          <div :class="{'in-stock': bookStore.book.availability_status === 'Còn hàng'}" class="availability-status">
            {{ bookStore.book.availability_status }}
          </div>
        </div>
        <p class="book-detail__info--short-desc" v-html="bookStore.book.short_description"></p>
        <div class="book-detail__info--function">
          <el-input-number v-model="num" :max="5" :min="1" class="custom-input-quantity function__quantity"
                           step-strictly @change="handleChange"/>
          <button class="user-btn" @click="addToCart">Mượn ngay</button>
          <button :class="{ 'active': wishlistStore.isInWishlist(bookStore.book.id) }" class="wishlist-btn"
                  @click.prevent.stop="wishlistStore.toggleWishlist(bookStore.book.id)">
            <img alt="" src="@/assets/img/User/wishlist-icon.svg">
          </button>
        </div>
        <div class="book-detail__info--delivery">
          <div class="delivery-details">
            <img alt="" src="@/assets/img/User/delivery-icon-1.svg">
            <div class="delivery-details__content">
              <p class="delivery-details__title">Free Delivery</p>
              <p class="delivery-details__sub-title">Enter your postal code for Delivery Availability</p>
            </div>
          </div>
          <div class="separator"></div>
          <div class="delivery-details">
            <img alt="" src="@/assets/img/User/delivery-icon-2.svg">
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
        <img alt="" src="@/assets/img/User/orange-before.svg" style="width: 15px">
        <span class="product-section__label">Mô tả sản phẩm</span>
      </div>
      <div class="book-detail__description--content" v-html="bookStore.book.description"></div>
    </div>

    <!--  Details  -->
    <div class="book-detail__description">
      <div class="book-detail__description--heading">
        <img alt="" src="@/assets/img/User/orange-before.svg" style="width: 15px">
        <span class="product-section__label">Thông tin chi tiết</span>
      </div>
      <div class="book-detail__description--content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Tác Giả">
            {{ bookStore.book.author.join(', ') }}
          </el-descriptions-item>
          <el-descriptions-item label="Số Trang">{{ bookStore.book.page }}</el-descriptions-item>
          <el-descriptions-item label="Nhà Xuất Bản">{{ bookStore.book.publisher }}</el-descriptions-item>
          <el-descriptions-item label="Số Lượng Trong Kho">{{ bookStore.book.stock_quantity }}</el-descriptions-item>
          <el-descriptions-item label="Năm Xuất Bản">{{ bookStore.book.published_year }}</el-descriptions-item>
          <el-descriptions-item label="Danh Mục">
            {{ bookStore.book.category.join(', ') }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!--  Review  -->
    <div class="book-detail__description">
      <div class="book-detail__description--heading">
        <img alt="" src="@/assets/img/User/orange-before.svg" style="width: 15px">
        <span class="product-section__label">Đánh giá</span>
      </div>
      <div class="book-detail__description--review">
        <!--   Review summary   -->
        <div class="review-summary">
          <div class="average-rating">
            <h3>{{ bookStore.book.average_star }}</h3>
            <el-rate
              v-model="bookStore.book.average_star"
              allow-half
              class="average-star"
              disabled
              size="large"
            />
            <div class="total-reviews">{{ bookStore.book.review_count }} đánh giá</div>
          </div>

          <div class="star-distribution">
            <div
              v-for="targetStar in 5"
              :key="targetStar"
              class="star-row"
            >
              <div class="star-label">
                {{ 6 - targetStar }} sao
                <el-rate
                  :max="6 - targetStar"
                  :model-value="6 - targetStar"
                  disabled
                />
              </div>
              <div class="bar-container">
                <el-progress
                  :color="barColor"
                  :percentage="getStarPercentage(6 - targetStar)"
                  :show-text=false
                  :stroke-width="12"
                />
                <div class="count">
                  {{ getStarCount(6 - targetStar) }} đánh giá
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-for="(review, index) in bookStore.reviews" :key="review.id" class="container">
          <img alt="" src="@/assets/img/User/user-icon.svg">
          <div>
            <div class="name">{{ review.user.full_name }}</div>
            <el-rate v-model="review.star" disabled></el-rate>
            <!-- Comment section -->
            <div class="comment-wrapper">
              <div
                :class="{
                    'line-clamp-2': review.comment.length > 270 && !showFullComment[index],
                    'expanded': showFullComment[index]
                }"
                class="comment"
                v-html="review.comment"
              ></div>

              <button
                v-if="review.comment.length > 270 && !showFullComment[index]"
                class="show-more-btn"
                @click="toggleComment(index)">
                Xem thêm
              </button>

              <button
                v-if="review.comment.length > 270 && showFullComment[index]"
                class="show-more-btn"
                @click="toggleComment(index)">
                Thu gọn
              </button>
            </div>
            <div class="date">{{ review.created_at }}</div>
          </div>
        </div>
        <Pagination
          v-if="bookStore.reviewPagination.total > 0"
          :pagination="bookStore.reviewPagination"
          @changePage="(page: number) => bookStore.handleReviewPageChange(page)"
        />
        <!--        <div v-else class="list__empty">Chưa có đánh giá nào</div>-->

        <div class="review-input">
          <p class="review-input__title">Bình luận và đánh giá của bạn</p>
          <el-rate v-model="userReview.star" class="star" size="large"></el-rate>
          <el-input
            v-model="userReview.comment"
            :rows="4"
            class="review-input__content"
            placeholder="Nhập bình luận của bạn"
            type="textarea"
            maxlength="500"
            :show-word-limit="true"

          />
          <button class="user-btn" @click="handleSubmitReview">Gửi</button>
        </div>
      </div>
    </div>

    <!--  Related books  -->
    <div class="product-section">
      <div class="product-section__header">
        <div style="display: flex; align-items: center; gap: 10px">
          <img alt="" src="@/assets/img/User/orange-before.svg" style="width: 15px">
          <span class="product-section__label">Gợi ý</span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 15px; justify-content: space-between">
          <h2 class="product-section__title">Các sản phẩm có liên quan</h2>
          <div class="product-section__paginate">
            <button @click="prevSlide">
              <el-icon size="large">
                <Back/>
              </el-icon>
            </button>
            <button @click="nextSlide">
              <el-icon size="large">
                <Right/>
              </el-icon>
            </button>
          </div>
        </div>
      </div>

      <el-carousel ref="carouselRef" arrow="never" class="no-responsive" indicator-position="none">
        <el-carousel-item v-for="(group, index) in relatedBooksGroup" :key="index" class="no-text-decoration">
          <div class="product-section__category">
            <ProductList :books="bookStore.relatedBooks"/>
          </div>
        </el-carousel-item>
      </el-carousel>

      <el-carousel ref="carouselRefForMobile" arrow="never" class="for-mobile" indicator-position="none">
        <el-carousel-item v-for="(group, index) in relatedBooksGroupForMobile" :key="index" class="no-text-decoration">
          <div class="product-section__category">
            <ProductList :books="bookStore.relatedBooks"/>
          </div>
        </el-carousel-item>
      </el-carousel>

      <el-carousel ref="carouselRefForTablet" arrow="never" class="for-tablet" indicator-position="none">
        <el-carousel-item v-for="(group, index) in relatedBooksGroupForTablet" :key="index" class="no-text-decoration">
          <div class="product-section__category">
            <ProductList :books="bookStore.relatedBooks"/>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheBreadCrumb from '@/components/User/Common/TheBreadCrumb.vue'
import {computed, onMounted, ref, watch} from 'vue'
import {useBookStore} from "@/stores/User/book.store";
import {useWishlistStore} from "@/stores/User/wishlist.store";
import {useRoute, useRouter} from 'vue-router'
import {useCartStore} from "@/stores/User/cart.store";
import {notifyError, notifySuccess} from "@/composables/notifications";
import Pagination from "@/components/User/Common/Pagination.vue";
import ProductList from "@/components/User/Common/ProductList.vue";

const route = useRoute()
const bookStore = useBookStore()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const carouselRef = ref()
const carouselRefForMobile = ref()
const carouselRefForTablet = ref()
const num = ref(1);
const router = useRouter()
const barColor = 'rgba(255,69,0,0.63)'
const handleChange = (value: number) => {
  num.value = value;
};
const mainImage = ref('');
const changeMainImage = (imageUrl: string) => {
  mainImage.value = imageUrl;
};
const loading = ref(true)

const addToCart = async () => {
  if (!bookStore.book) return;
  try {
    const success = await cartStore.addToCart(bookStore.book.id, num.value);
    if (success) {
      await router.push('/cart');
    }
  } catch (error) {
    console.error("Failed to add to cart", error);
  }
};

const userReview = ref({
  star: 0,
  comment: "",
});

const handleSubmitReview = async () => {
  if (!userReview.value.star) {
    notifyError("Vui lòng chọn số sao!");
    return;
  }

  if (!userReview.value.comment.trim()) {
    notifyError("Vui lòng nhập bình luận!");
    return;
  }

  await bookStore.submitReview(bookStore.book.id, userReview.value.star, userReview.value.comment);

  userReview.value.star = 0;
  userReview.value.comment = "";
  // notifySuccess("Cảm ơn bạn! Đánh giá sẽ hiển thị sau khi được Admin duyệt.");
};

const booksPerSlide = 4
const booksPerSlideForMobile = 2
const booksPerSlideForTablet  = 3
const relatedBooksGroup = computed(() => {
  const groups = []
  for (let i = 0; i < bookStore.relatedBooks.length; i += booksPerSlide) {
    groups.push(bookStore.relatedBooks.slice(i, i + booksPerSlide))
  }
  console.log('relatedBooksGroup:', groups)
  return groups
})
const relatedBooksGroupForMobile = computed(() => {
  const groups = []
  for (let i = 0; i < bookStore.relatedBooks.length; i += booksPerSlideForMobile) {
    groups.push(bookStore.relatedBooks.slice(i, i + booksPerSlideForMobile))
  }
  console.log('relatedBooksGroup:', groups)
  return groups
})

const relatedBooksGroupForTablet = computed(() => {
  const groups = []
  for (let i = 0; i < bookStore.relatedBooks.length; i += booksPerSlideForTablet) {
    groups.push(bookStore.relatedBooks.slice(i, i + booksPerSlideForTablet))
  }
  console.log('relatedBooksGroup:', groups)
  return groups
})

const prevSlide = () => {
  if (window.innerWidth > 678) {
    carouselRef.value?.prev()
  } else {
    carouselRefForMobile.value?.prev()
  }
}

const nextSlide = () => {
  if (window.innerWidth > 768) {
    carouselRef.value?.next()
  } else {
    carouselRefForMobile.value?.next()
  }
}

const getStarCount = (star: number) => {
  return bookStore.book.star_distribution[star - 1] || 0;
};

const getStarPercentage = (star: number) => {
  const total = bookStore.book.review_count;
  return total > 0 ? Math.round((getStarCount(star) / total * 100)) : 0;
};


const showFullComment = ref<Record<number, boolean>>({});
const toggleComment = (index: number) => {
  showFullComment.value[index] = !showFullComment.value[index];
};

watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      loading.value = true;
      await bookStore.fetchBookBySlug(newSlug as string);
      mainImage.value = bookStore.book?.image_url || '';
      await bookStore.fetchReviews(newSlug as string);
      await bookStore.fetchRelatedBooks(newSlug as string);
      loading.value = false;
    }
  }
);

onMounted(async () => {
  const slug = route.params.slug as string;
  await bookStore.fetchBookBySlug(slug);
  mainImage.value = bookStore.book?.image_url || '';
  await bookStore.fetchReviews(slug);
  await bookStore.fetchRelatedBooks(slug);
  loading.value = false
})
</script>

<style lang="scss" scoped>
:deep(.is-bordered-label) {
  background-color: #fff !important;
  font-weight: 500 !important;
  width: 250px !important;
}

:deep(.el-descriptions__body) {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-descriptions__cell) {
  border: 1px solid #ccc !important;
}

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

    @media (max-width: 767px) {
      flex-direction: column;
    }

    @media (min-width: 767px) and (max-width: 1200px) {
      flex-direction: column;
    }
  }

  &__images {
    display: flex;

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 10px;
    }

    .additional-images {
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: center;

      @media (max-width: 767px) {
        flex-direction: row;
        order: 2;
      }
      @media (max-width: 425px) {
        flex-direction: row;
        gap: 10px;
      }
    }

    .additional-image {
      width: 100px;
      height: 110px;
      object-fit: cover;
      padding: 15px 30px;
      background-color: #f5f5f5;
      border-radius: 5px;

      @media (max-width: 767px) {
        width: 61px;
        height: 80px;
        padding: 10px 15px;
        margin-bottom: 30px;
      }

      @media (max-width: 430px) {
        width: 58px;
        height: 70px;
        padding: 10px 17px;
        margin-bottom: 30px;
      }

      @media (max-width: 376px) {
        width: 61px;
        height: 70px;
        padding: 10px 17px;
        margin-bottom: 30px;
      }
    }

    .main-image {
      width: 400px;
      height: 542px;
      padding: 32px 60px;
      background-color: #f5f5f5;
      border-radius: 5px;
      object-fit: cover;

      @media (min-width: 1440px) {
        margin: 0 70px 0 30px;
      }

      @media (max-width: 767px) {
        width: 290px;
        height: 400px;
        //margin: -15px 0 15px 0;
      }

      //@media (max-width: 425px) {
      //  width: 230px;
      //  //margin: -15px 50px 15px 50px;
      //  height: 300px;
      //}

      @media (max-width: 376px) {
        width: 290px;
        //margin: -15px 50px 15px 50px;
        height: 350px;
        padding: 20px 60px;
      }
    }
  }

  &__info {
    flex: 1;
    //width: 80px;
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
        font-size: 14px;
        margin-right: 10px;
        padding-right: 15px;
        border-right: 1px solid #FF4500C7;
      }
    }

    &--short-desc {
      line-height: 24px;
      border-bottom: 1px solid #00000080;
      padding-bottom: 30px;
    }

    &--function {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      @media (max-width: 425px) {
        .user-btn {
          width: 140px !important;
        }
      }

      @media (max-width: 325px) {
        .user-btn {
          width: 95px !important;
        }
      }

      .user-btn {
        width: 200px;
        height: 40px;
        justify-content: center;

        @media (max-width: 376px) {
          width: 170px !important;
        }

        @media (min-width: 377px) and (max-width: 431px) {
          width: 180px !important;
        }
      }

      .wishlist-btn {
        border-radius: 5px;
        border: 1px solid #00000080;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 45px;
        background-color: #fff;
        cursor: pointer;

        &:hover {
          background-color: var(--user-theme-color);
          border-color: #fff;

          img {
            filter: invert(1);
          }
        }

        &.active {
          background-color: var(--user-theme-color);
          border-color: var(--user-theme-color);

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
      margin-top: 40px;
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
      white-space: pre-wrap;
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
          font-size: 17px;
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
        padding: 23px 30px;

        @media (max-width: 768px) {
          padding: 20px 15px 15px 15px;
        }
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
        white-space: pre-wrap;
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

.product-section__category {
  justify-content: flex-start;
}

.pagination-container {
  margin-top: 10px;
}

.list__empty {
  padding: 0 2rem;
  font-size: 1rem;
  font-weight: 400;
  color: #888888;
  text-align: center;
  margin-top: 30px;
  margin-bottom: -40px;
}

.review-summary {
  display: flex;
  padding: 20px 40px 28px 40px;
  align-items: center;
  border-bottom: 1px solid #ccc;

  @media (max-width: 767px) {
    flex-direction: column;
    padding: 20px;
  }
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0.3;
  padding-right: 60px;

  @media (min-width: 1023px) and (max-width: 1024px) {
    padding-right: 30px;
  }

  @media (max-width: 767px) {
    padding-right: 0;
  }

  h3 {
    font-size: 60px;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 43px;
    }
  }

  .total-reviews {
    font-size: 18px;
    font-weight: 500;
    color: #858585;
    margin-top: 6px;

    @media (max-width: 768px) {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
}

.star-label {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 15px;
}

.bar-container {
  display: flex;
  gap: 20px;
}

:deep(.el-progress) {
  width: 620px !important;
}

.star-distribution {
  flex: 1;

  @media (max-width: 430px) {
    width: 100%;
    padding: 0;

    :deep(.el-progress--without-text) {
      height: 10px;
      width: 205px !important;
    }

    :deep(.el-progress-bar__outer) {
      width: 205px !important;
    }
    .count {
      flex: 1;
    }

    :deep(.bar-container) {
      align-items: center;
      margin-bottom: 10px;
    }
  }

  @media (max-width: 767px) {
    width: 100%;
    padding: 0;

    :deep(.el-progress--without-text) {
      height: 10px;
      width: 260px !important;
    }

    :deep(.el-progress-bar__outer) {
      width: 260px !important;
    }
    .count {
      flex: 1;
    }

    :deep(.bar-container) {
      align-items: center;
      margin-bottom: 10px;
    }
  }

  //@media (max-width: 325px) {
  //  width: 100%;
  //  padding: 0;
  //
  //  :deep(.el-progress--without-text) {
  //    height: 10px;
  //    width: 151px !important;
  //  }
  //
  //  :deep(.el-progress-bar__outer) {
  //    width: 151px !important;
  //  }
  //  .count {
  //    flex: 1;
  //  }
  //
  //  :deep(.bar-container) {
  //    align-items: center;
  //    margin-bottom: 10px;
  //  }
  //}
}

.average-star {
  --el-rate-icon-size: 26px;
  padding: 5px 0;
}

:deep(.product-card) {
  width: 268px;
  //
  //@media (max-width: 768px) {
  //  width: 48%;
  //}

  @media (max-width: 768px) {
    width: 47.5%;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 46.8% !important;
  }

  @media (min-width: 1024px) and (max-width: 1200px) {
    width: 31% !important;
  }
}

:deep(.el-carousel__container) {
  height: 390px;

  @media (max-width: 376px) {
    height: 590px;
  }

  @media (min-width: 377px) and (max-width: 368px) {
    height: 630px;
  }

  @media (min-width: 369px) and (max-width: 428px) {
    height: 590px;
  }

  @media (min-width: 429px) and (max-width: 768px) {
    height: 600px;
  }

  @media (min-width: 767px) and (max-width: 1023px) {
    height: 470px;
  }

  @media (min-width: 1024px) and (max-width: 1024px) {
    height: 350px;
  }
  //@media (max-width: 380px) {
  //  height: 500px;
  //}
}

:deep(.product-section__category) {
  margin-top: 0;
}

:deep(.product-section__label) {
  font-size: 17px;
}

@media (max-width: 768px) {
  :deep(.is-bordered-label) {
    width: 180px !important;
  }
}

@media (min-width: 768px) and (max-width: 1200px) {
  .main-image {
    width: 420px !important;
    margin: 0 0 0 30px !important;
  }

  .book-detail__images {
    justify-content: center !important;
  }

  .book-detail__info--title {
    margin-top: 30px;
  }
}

@media (min-width: 1023px) and (max-width: 1200px) {
  .main-image {
    width: 570px !important;
    height: 745px !important;
    margin: 0 0 0 30px !important;
  }

  .additional-image {
    width: 150px !important;
    height: 160px !important;
  }
}

@media (min-width: 768px) and (max-width: 1000px) {
  :deep(.el-progress) {
    width: 76% !important;
  }
}

@media (min-width: 1000px) and (max-width: 1200px) {
  :deep(.el-progress) {
    width: 84% !important;
  }
}

@media (min-width: 480px) {
  .book-detail__info--function {
    justify-content: start;
    gap: 20px;
  }
}

@media (min-width: 1440px) {
  .book-detail__info--function {
    justify-content: start;
    gap: 16px !important;
  }
}

.availability-status {
  margin-top: 2px;
  font-weight: 400;
  font-size: 14px;
}

.in-stock {
  color: #00FF66;
  font-weight: 400;
  font-size: 14px;
}

.pagination-container {
  margin-bottom: 1px;
}

.show-more-btn {
  background: none;
  color: var(--user-theme-color);
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
}

.comment-wrapper {
  position: relative;
}

.comment {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment.expanded {
  -webkit-line-clamp: unset;
}
</style>

<style lang="scss">
.el-input-number__decrease:hover, .el-input-number__increase:hover {
  background-color: var(--user-theme-color);

  .el-icon {
    color: #fff;
  }
}

.product-section {
  margin-top: 100px;
}
</style>
