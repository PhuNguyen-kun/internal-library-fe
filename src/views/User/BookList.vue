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

  <div class="filter-button" @click="toggleFilter">
    <el-icon class="icon"><Filter /></el-icon>
  </div>

  <!-- Cập nhật filter-sidebar -->
  <div class="filter-sidebar" :class="{ active: isFilterOpen }">
    <!-- Thêm nút đóng mobile -->
    <div class="close-btn" @click="toggleFilter">
      <el-icon><Close /></el-icon>
    </div>

    <!-- Di chuyển filter section vào đây -->
    <div class="mobile-filter-section">
      <h2>Sắp xếp theo:</h2>
      <div class="sort-options">
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
    </div>

    <!-- Di chuyển sidebar vào đây -->
    <div class="mobile-sidebar">
      <div class="sidebar">
        <!-- Danh mục -->
        <div class="sidebar__item">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon"><Grid /></el-icon>
            <span>Danh mục</span>
          </div>
          <div class="sidebar__item--content">
            <el-scrollbar ref="scrollbarRef" height="400px">
              <ul>
                <li
                  v-for="category in bookStore.categories"
                  :key="category.id"
                  ref="categoryRefs"
                >
                  <label
                    :class="{ 'active': selectedCategory === category.slug }"
                    :ref="el => category.slug === selectedCategory ? activeCategoryRef = el : null"
                  >
                    <input
                      type="checkbox"
                      :value="category.slug"
                      :checked="selectedCategory === category.slug"
                      @change="toggleFilter('category', category.slug)"
                    />
                    {{ category.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>

        <!-- Tác giả -->
        <div class="sidebar__item">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon"><StarFilled /></el-icon>
            <span>Tác giả</span>
          </div>
          <div class="sidebar__item--content">
            <el-scrollbar height="400px">
              <ul>
                <li v-for="author in bookStore.authors" :key="author.id">
                  <label :class="{ 'active': selectedAuthor === author.slug }">
                    <input
                      type="checkbox"
                      :value="author.slug"
                      :checked="selectedAuthor === author.slug"
                      @change="toggleFilter('author', author.slug)"
                    />
                    {{ author.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>

        <!-- Nhà xuất bản -->
        <div class="sidebar__item">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon"><HomeFilled /></el-icon>
            <span>Nhà xuất bản</span>
          </div>
          <div class="sidebar__item--content">
            <el-scrollbar height="400px">
              <ul>
                <li v-for="publisher in bookStore.publishers" :key="publisher.id">
                  <label :class="{ 'active': selectedPublisher === publisher.slug }">
                    <input
                      type="checkbox"
                      :value="publisher.slug"
                      :checked="selectedPublisher === publisher.slug"
                      @change="toggleFilter('publisher', publisher.slug)"
                    />
                    {{ publisher.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="filter-sidebar__overlay"
    :class="{ active: isFilterOpen }"
    @click="toggleFilter"
  ></div>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import TheSidebar from "@/components/User/Common/TheSidebar.vue";
import { useBookStore } from "@/stores/User/book.store";
import {onMounted, watchEffect, watch, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/User/Common/Pagination.vue";
import ProductList from "@/components/User/Common/ProductList.vue";

const bookStore = useBookStore();
const route = useRoute();
const router = useRouter();
const selectedSort = ref<string>();
const isFilterOpen = ref(false);
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const closeFilter = () => {
  isFilterOpen.value = false;
}

const toggleSort = (sortType: string) => {
  selectedSort.value = selectedSort.value === sortType ? undefined : sortType;
  updateFilters();
};

const updateFilters = () => {
  const newQuery = { ...route.query };
  newQuery.sort = selectedSort.value as string;
  router.push({ query: newQuery });
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  bookStore.fetchTopBorrowedBooks();
  // bookStore.fetchBooks();
});

watchEffect(() => {
  selectedSort.value = route.query.sort as string;
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
  scrollToTop();
});
</script>

<style scoped lang="scss">
.book-list {
  &__container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
      margin-top: 10px;
    }
  }

  &__sidebar {
    width: 17rem;
  }

  &__content {
    width: calc(100% - 17rem);

    @media (max-width: 768px) {
      width: 100%;
    }

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

      @media (max-width: 768px) {
        display: none;
      }

      h2 {
        font-weight: 400;
      }

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

    @media (max-width: 768px) {
      gap: 20px;
    }
  }

  :deep(.product-card) {
    width: calc(32% - 20px);

    @media (max-width: 768px) {
      width: calc(52% - 20px);
    }
  }

  :deep(.product-card__image) {
    height: 250px;
    @media (max-width: 768px) {
      height: 200px;
    }

    img {
      width: 65%;
      height: 86%;
      object-fit: cover;
      @media (max-width: 768px) {
        width: 60%;
        height: 80%;
        object-fit: cover;
      }
    }
  }

  :deep(.product-card__actions) {
    top: 6px;
    right: 6px;

    @media (max-width: 768px) {
      top: 5px;
      right: 3px;
    }

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

.filter-button {
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    background-color: #FF4500FF;
    border-radius: 50%;
    padding: 15px;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);

    .icon {
      color: white;
    }
  }
}

.filter-sidebar {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  left: auto;
  width: 70%;
  height: 100vh;
  background: white;
  transition: right 0.3s ease;
  padding: 20px;
  overflow-y: auto;
  z-index: 99999;

  &.active {
    right: 0;
  }

  @media (max-width: 768px) {
    display: block;
    right: -100%;
    transform: none;
    transition: right 0.3s ease;

    &.active {
      right: 0;
      transform: none;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      left: 0;
      padding: 8px;
      cursor: pointer;

      .el-icon {
        font-size: 24px;
        color: #666;
      }
    }

    .mobile-filter-section {
      margin-top: 30px;

      h2 {
        font-weight: 500;
        font-size: 16px;
      }
    }

    .sort-options {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 18px;
    }

    .mobile-sidebar {
      display: block;
      height: 500px !important;
    }
  }
}

.filter-sidebar__overlay {
  visibility: hidden;
  opacity: 0;
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    opacity: 0;
    visibility: hidden;
    z-index: 9999;

    &.active {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
