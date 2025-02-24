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
    width="30%"
    center
    top="20vh"
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
import {notifySuccess} from "@/composables/notifications";
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
  notifySuccess('Thêm vào giỏ hàng thành công');
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
    notifySuccess("Danh sách yêu thích trống!");
    return;
  }

  try {
    for (const item of wishlistStore.wishlists) {
      await cartStore.addToCart(item.book.id, 1);
    }
    notifySuccess("Đã thêm tất cả sách vào giỏ hàng!");
  } catch (error) {
    console.error("Failed to add all books to cart", error);
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
  }
}

.product-section {
  &__items {
    flex-wrap: wrap;
  }

  .product-card {
    width: calc(25% - 30px);
  }
}

.action-buttons:hover {
  img {
    filter: none;
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
</style>
