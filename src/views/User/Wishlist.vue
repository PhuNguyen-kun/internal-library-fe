<template>
  <TheBreadCrumb />

  <div class="wishlist">
    <div class="wishlist__heading">
      Danh sách yêu thích ({{ wishlistStore.wishlists.length }})
      <div class="user-white-btn" @click="addAllToCart">Thêm tất cả vào giỏ hàng</div>
    </div>

    <div v-if="wishlistStore.wishlists.length === 0" class="list__empty">Không có sản phẩm yêu thích</div>

    <div class="product-section">
      <div class="product-section__items">
        <router-link :to="'/books/' + book.book.slug" class="product-card" v-for="book in wishlistStore.wishlists" :key="book.id">
          <div class="product-card__image">
            <img :src="book.book.image_url" alt="Book Image" class="img">
            <div class="product-card__add-to-cart">
              <button @click.prevent.stop="addToCart(book)">
                <img src="@/assets/img/User/card-icon-white.svg" alt="">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
          <div class="product-card__actions">
            <div class="action-buttons" @click.prevent.stop="handleRemoveFromWishlist(book)"><img src="@/assets/img/User/delete-icon.svg" alt=""></div>
          </div>
          <div class="product-card__info">
            <h3 class="product-card__info--title no-text-decoration">{{ book.book.title }}</h3>
            <div class="product-card__info--review">
              <el-rate v-model="book.book.average_star" disabled disabled-void-color="#E5E5E5"></el-rate>
              <div class="review-count">({{book.book.review_count}})</div>
            </div>
          </div>
        </router-link>
      </div>

      <Pagination
        :pagination="wishlistStore.pagination"
        @changePage="(page: number) => wishlistStore.handlePageChange(page)"
      />
    </div>
  </div>

  <el-dialog
    v-model="isDeleteDialogVisible"
    title="Xác nhận xóa"
    center
    top="20vh"
    class="delete-dialog"
  >
    <span>Bạn có chắc muốn xóa sản phẩm khỏi danh sách yêu thích?</span>
    <template #footer>
      <el-button @click="isDeleteDialogVisible = false">Hủy</el-button>
      <el-button type="danger" @click="confirmRemoveItem">Xóa</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import { useWishlistStore } from "@/stores/User/wishlist.store";
import {onMounted, ref} from "vue";
import Pagination from "@/components/User/Common/Pagination.vue";
import {notifyError, notifyInfo, notifySuccess} from "@/composables/notifications";
import {useCartStore} from "@/stores/User/cart.store";

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const isDeleteDialogVisible = ref(false);
const selectedBookId = ref<number | null>(null);

const handleRemoveFromWishlist = (book: any) => {
  selectedBookId.value = book.book.id;
  isDeleteDialogVisible.value = true;
};
const addToCart = async (book: any) => {
  await cartStore.addToCart(book.book.id);
};

const confirmRemoveItem = async () => {
  if (selectedBookId.value !== null) {
    await wishlistStore.removeFromWishlist(selectedBookId.value);
    isDeleteDialogVisible.value = false;
    notifySuccess("Xóa khỏi danh sách yêu thích thành công");
  }
};

const addAllToCart = async () => {
  if (wishlistStore.wishlists.length === 0) {
    notifyInfo("Danh sách yêu thích trống!");
    return;
  }

  try {
    const books = wishlistStore.wishlists.map(item => ({
      id: item.book.id,
      quantity: 1
    }));

    await cartStore.addAllToCart(books);
  } catch (error) {
    console.error("Failed to add all books to cart", error);
    notifyError("Có lỗi xảy ra khi thêm sách vào giỏ hàng");
  }
};
onMounted(() => {
  wishlistStore.fetchWishlists();
});
</script>

<style scoped lang="scss">
.wishlist {
  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    margin-top: 30px;

    @media (max-width: 768px) {
      display: flex;

      .user-white-btn {
        width: 100px;
        text-align: center;
        line-height: 18px;
        padding: 5px 15px;
      }
    }
  }
}

.product-section {
  &__items {
    flex-wrap: wrap;

    @media (max-width: 992px) {
      justify-content: space-between;
      gap: 10px;
    }
  }

  .product-card {
    //width: calc(25% - 30px);

    @media (max-width: 374.8px) {
        width: 100%;
    }

    //@media (min-width: 375px) and (max-width: 393px) {
    //    width: calc(55% - 25px);
    //}
    @media (min-width: 393px) and (max-width: 480px) {
        width: calc(55% - 30px);
    }
    @media (min-width: 480px) and (max-width: 678px) {
        width: calc(55% - 40px);
    }
    @media (min-width: 678px) and (max-width: 768px) {
        width: calc(55% - 50px);
    }
    @media (min-width: 768px) and (max-width: 826px) {
        width: calc(55% - 190px);
    }

    @media (min-width: 826px)  and  (max-width: 932.2px) {
      width: calc(55% - 210px);
    }
    @media (min-width: 932.2px)  and  (max-width: 1033px) {
      width: calc(55% - 231px);
    }
    @media (min-width: 1033px)  and  (max-width: 1100px) {
      width: calc(55% - 232.5px);
    }
    @media (min-width: 1100px)  and  (max-width: 1200px) {
      width: calc(55% - 231px);
    }

    //@media (max-width: 375px) {
    //  width: 100% !important;
    //}
    //@media (max-width: 768px) {
    //  width: calc(55% - 30px);
    //}
    //@media (max-width: 992px) {
    //  width: calc(50% - 30px);
    //}
  }
}

.action-buttons:hover {
  img {
    filter: none;
  }
}

.product-card__image {
  @media (max-width: 992px) {
    height: 200px;
  }
}

.list__empty {
  padding: 1.3rem 2rem;
  font-size: 1rem;
  font-weight: 400;
  color: #888888;
  text-align: center;
  margin-top: 100px;
}

@media (min-width: 1440px) {
  .product-section {
    width: 1170px;
  }

  .product-card {
    width: calc(25% - 23px);
  }
}

.user-white-btn {
  width: 120px !important;
  border: 1px solid #00000080;
  padding: 5px 20px;
  line-height: 18px;
  text-align: center;
  font-weight: 500;
}

.product-section {
  margin-top: 60px !important;
}

.product-section__items {
  @media (min-width: 992px) and (max-width: 1200px) {
    flex-wrap: wrap;
    gap: 41px;
  }
}

:deep(.product-card__image) {
  @media (min-width: 1023px) {
    height: 250px !important;
  }
}
</style>
