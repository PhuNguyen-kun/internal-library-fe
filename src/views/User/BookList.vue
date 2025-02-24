<template>
  <div class="page-wrapper">
    <div>
      <TheBreadCrumb />
    </div>

    <div class="book-list__container">
      <div class="book-list__sidebar">
        <TheSidebar />
      </div>
      <div class="book-list__content">
        <h1 class="title">Sách</h1>
        <div class="filter-section">
            <h2>Sắp xếp theo:</h2>
          <label class="sort-label" :class="{ 'active': selectedSort === 'most_borrowed'}">
            <input
              type="checkbox"
              value="most_borrowed"
              :checked="selectedSort === 'most_borrowed'"
              @change="toggleSort('most_borrowed')"
            />
            Được mượn nhiều nhất
          </label>
          <label class="sort-label" :class="{ 'active': selectedSort === 'most_loved'}">
            <input
              type="checkbox"
              value="most_loved"
              :checked="selectedSort === 'most_loved'"
              @change="toggleSort('most_loved')"
            />
            Được yêu thích nhất
          </label>
          <label class="sort-label" :class="{ 'active': selectedSort === 'ratings' }">
            <input
              type="checkbox"
              value="ratings"
              :checked="selectedSort === 'ratings'"
              @change="toggleSort('ratings')"
            />
            Được đánh giá cao
          </label>
        </div>

        <div v-if="bookStore.books.length === 0" class="no-products">Không có sản phẩm nào phù hợp với tìm kiếm của bạn.</div>

        <div class="book-list__section">
          <div class="product-section">
            <ProductList :books="bookStore.books" custom-class="product-section__items"/>
          </div>
        </div>

        <Pagination
          :pagination="bookStore.pagination"
          @changePage="(page: number) => bookStore.handlePageChange(page)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import TheSidebar from "@/components/User/Common/TheSidebar.vue";
import { useBookStore } from "@/stores/User/book.store";
import {onMounted, watchEffect, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/User/Common/Pagination.vue";
import ProductList from "@/components/User/Common/ProductList.vue";

const bookStore = useBookStore();
const route = useRoute();
const router = useRouter();
const selectedSort = ref<string>();

const toggleSort = (sortType: string) => {
  selectedSort.value = selectedSort.value === sortType ? undefined : sortType;
  updateFilters();
};

const updateFilters = () => {
  const newQuery = { ...route.query };
  newQuery.sort = selectedSort.value as string;
  router.push({ query: newQuery });
};

watchEffect(() => {
  selectedSort.value = route.query.sort as string;
});

onMounted(() => {
  bookStore.fetchTopBorrowedBooks();
  // bookStore.fetchBooks();
});

watchEffect(() => {
  const filters = {
    search_term: route.query.search_term || null,
    category_slug: route.query.category || null,
    author_slug: route.query.author || null,
    publisher_slug: route.query.publisher || null,
    sort: route.query.sort || null,
  };

  console.log("Applying filters:", filters);
  bookStore.fetchBooks(filters);
});
</script>

<style scoped lang="scss">
.book-list {
  &__container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 40px;
  }

  &__sidebar {
    width: 17rem;
  }

  &__content {
    width: calc(100% - 17rem);

    .title {
      font-size: 25px;
      font-weight: 500;
      margin-bottom: 25px;
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 15px;
      font-weight: 400;

      .sort-options {
        display: flex;
        gap: 15px;
      }

      .sort-label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        font-size: 14px;
        color: #9f9f9f;
        font-weight: 500;
        padding: 5px;
        border-radius: 5px;
        transition: background-color 0.3s ease, color 0.3s ease;
        width: 200px;

        input {
          cursor: pointer;
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #999;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
        }

        input:checked {
          border-color: var(--user-theme-color);
          background-color: var(--user-theme-color);
        }

        input:checked::after {
          content: '✔';
          color: white;
          font-size: 12px;
          font-weight: bold;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .active {
        color: var(--user-theme-color);
        font-weight: 600;
      }
    }
  }
}

.product-section {
  margin-top: 0;

  &__items {
    gap: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  :deep(.product-card) {
    width: calc(32% - 20px);
  }

  :deep(.product-card__image) {
    height: 250px;

    img {
      width: 65%;
      height: 86%;
      object-fit: cover;
    }
  }

  :deep(.product-card__actions) {
    top: 6px;
    right: 6px;

    .action-buttons {
      width: 5px;
      height: 12px;

      img {
        width: 17px;
      }
    }
  }

  :deep(.product-card__add-to-cart img) {
    width: 25px;
  }
}
</style>
