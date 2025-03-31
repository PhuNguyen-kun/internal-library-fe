<template>
  <div class="page-wrapper">
    <div>
      <TheBreadCrumb/>
    </div>

    <div class="book-list__container">
      <div class="book-list__sidebar no-responsive">
        <TheSidebar/>
      </div>
      <div class="book-list__content">
        <h1 class="title">Sách</h1>
        <div class="filter-section">
          <h2>Sắp xếp theo:</h2>
          <label :class="{ 'active': selectedSort === 'most_borrowed'}" class="sort-label">
            <input
              :checked="selectedSort === 'most_borrowed'"
              type="checkbox"
              value="most_borrowed"
              @change="toggleSort('most_borrowed')"
            />
            Được mượn nhiều nhất
          </label>
          <label :class="{ 'active': selectedSort === 'most_loved'}" class="sort-label">
            <input
              :checked="selectedSort === 'most_loved'"
              type="checkbox"
              value="most_loved"
              @change="toggleSort('most_loved')"
            />
            Được yêu thích nhất
          </label>
          <label :class="{ 'active': selectedSort === 'ratings' }" class="sort-label">
            <input
              :checked="selectedSort === 'ratings'"
              type="checkbox"
              value="ratings"
              @change="toggleSort('ratings')"
            />
            Được đánh giá cao
          </label>
        </div>

        <div v-if="bookStore.books.length === 0" class="no-products">Không có sản phẩm nào phù hợp với tìm kiếm của
          bạn.
        </div>

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
    <el-icon class="icon">
      <Filter/>
    </el-icon>
  </div>

  <div :class="{ active: isFilterOpen }" class="filter-sidebar">
    <div class="close-btn" @click="toggleFilter">
      <el-icon>
        <Close/>
      </el-icon>
    </div>

    <div class="filter-sidebar__container" style="display: flex; flex-direction: column; overflow-y: auto; height: 100%">
      <div class="mobile-filter-section">
        <h2>Sắp xếp theo:</h2>
        <div class="sort-options">
          <label :class="{ 'active': selectedSort === 'most_borrowed'}" class="sort-label">
            <input
              :checked="selectedFilters.sort === 'most_borrowed'"
              type="checkbox"
              value="most_borrowed"
              @change="toggleSort('most_borrowed')"
            />
            Được mượn nhiều nhất
          </label>
          <label :class="{ 'active': selectedSort === 'most_loved'}" class="sort-label">
            <input
              :checked="selectedFilters.sort === 'most_loved'"
              type="checkbox"
              value="most_loved"
              @change="toggleSort('most_loved')"
            />
            Được yêu thích nhất
          </label>
          <label :class="{ 'active': selectedSort === 'ratings' }" class="sort-label">
            <input
              :checked="selectedFilters.sort === 'ratings'"
              type="checkbox"
              value="ratings"
              @change="toggleSort('ratings')"
            />
            Được đánh giá cao
          </label>
        </div>

      </div>
      <TheSidebar :selectedSort="selectedSort" @updateFilters="updateFilters"/>
    </div>

    <div :class="{ active: isFilterOpen }" class="confirm-container">
      <button class="confirm user-btn" @click="applyFilters">Áp dụng</button>
    </div>
  </div>

  <div
    :class="{ active: isFilterOpen }"
    class="filter-sidebar__overlay"
    @click="toggleFilter"
  ></div>
</template>

<script lang="ts" setup>
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import TheSidebar from "@/components/User/Common/TheSidebar.vue";
import {useBookStore} from "@/stores/User/book.store";
import {onMounted, ref, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import Pagination from "@/components/User/Common/Pagination.vue";
import ProductList from "@/components/User/Common/ProductList.vue";

const bookStore = useBookStore();
const route = useRoute();
const router = useRouter();
const selectedSort = ref<string>();

const isFilterOpen = ref(false);
const toggleFilter = () => {
  if (isFilterOpen.value) {
    if (selectedFilters.value.sort !== selectedSort.value) {
      selectedFilters.value.sort = selectedSort.value;
    }
  }

  // Chuyển trạng thái mở/đóng của filter
  isFilterOpen.value = !isFilterOpen.value;
};

// const closeFilter = () => {
//   isFilterOpen.value = false;
// }

const toggleSort = (sortType: string) => {
  selectedSort.value = selectedSort.value === sortType ? undefined : sortType;
  updateFilters();
};

const selectedFilters = ref({
  sort: selectedSort.value,
});

const toggleSortForMobile = (sortType: string) => {
  if (selectedFilters.value.sort === sortType) {
    selectedFilters.value.sort = undefined;
  } else {
    selectedFilters.value.sort = sortType;
  }
};

const applyFilters = () => {
  // selectedSort.value = selectedFilters.value.sort;
  isFilterOpen.value = !isFilterOpen.value;
  //
  // updateFilters();
  // bookStore.fetchBooks({ sort: selectedSort.value });
};

const updateFilters = () => {
  const newQuery = {...route.query};
  newQuery.sort = selectedSort.value as string;
  router.push({query: newQuery});
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

<style lang="scss" scoped>
.filter-sidebar__container {
  @media (max-width: 768px) {
    margin-top: 15px;

    .el-main {
      overflow: hidden;
    }
  }
}

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

    @media (max-width: 992px) {
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
    @media (max-width: 992px) {
      width: 100%;
    }
    @media (max-width: 1200px) {
      width: 100%;
    }

    .title {
      font-size: 25px;
      font-weight: 500;
      margin-bottom: 25px;

      @media (max-width: 1200px) {
        margin-top: 20px;
      }
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 15px;
      font-weight: 400;

      @media (max-width: 1200px) {
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
          width: 18px;
          height: 18px;
          border: 2px solid #999;
          border-radius: 99999px;
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

  @media (max-width: 380px) {
  }

  input {
    cursor: pointer;
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #999;
    border-radius: 999px;
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

.product-section {
  margin-top: 0;

  &__items {
    gap: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;

    @media (max-width: 992px) {
      flex-wrap: wrap;
      gap: 44px;
    }
    @media (max-width: 767px) {
      flex-wrap: wrap;

      gap: 20.2px;
    }

    @media (min-width: 768px) {
      flex-wrap: wrap;
      //gap: 29px;
    }

    //@media (max-width: 992px) {
    //  justify-content: center !important;
    //  gap: 20px;
    //}
    @media (min-width: 992px) and (max-width: 1200px) {
      flex-wrap: wrap;
      gap: 46px;
    }
  }

  :deep(.product-card) {
    width: calc(32% - 20px);

    @media (max-width: 1200px) {
      width: 30%;
    }

    @media (max-width: 992px) {
      width: 47%;
    }

    @media (max-width: 825px) {
      width: 46.8%;
    }

    @media (max-width: 768px) {
      //width: 48%;
    }

    @media (max-width: 480px) {
      width: 47.5%;
    }

    //@media (max-width: 375px) {
    //  width: 100%;
    //}

  }

  :deep(.product-card__image) {
    //height: 250px;
    //@media (max-width: 768px) {
    //  height: 200px;
    //}

    @media (min-width: 1023px) {
      height: 250px !important;
    }

    @media (max-width: 768px) {
      height: 320px;
    }

    @media (max-width: 540px) {
      height: 180px;
    }
    //@media (max-width: 375px) {
    //  height: 300px;
    //}

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

  @media (max-width: 1200px) {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 5%;
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
  bottom: 0;
  //height: 100vh;
  background: white;
  transition: right 0.3s ease;
  padding: 20px;
  //overflow-y: auto;
  z-index: 99999;

  &.active {
    right: 0;
  }
  @media (max-width: 768px) {
    width: 80%;
    padding: 25px 10px;
    padding-bottom: 40px;
  }
  //@media (max-width: 768px) {
  //  width: 91%;
  //}

  @media (min-width: 768px) and (max-width: 1200px) {
    width: 60%;
    display: block;
    right: -100%;
    transform: none;
    transition: right 0.3s ease;
    padding-bottom: 40px;

    &.active {
      right: 0;
      transform: none;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      left: 0;
      padding: 1px 8px;
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
      gap: 5px;
      margin-top: 18px;
      margin-bottom: 20px;
    }

    .mobile-sidebar {
      display: block;
      height: 500px !important;
    }

    :deep(.el-scrollbar__wrap) {
      height: 200px;
    }
  }

  @media (max-width: 567px) {
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
      padding: 1px 8px;
      cursor: pointer;

      .el-icon {
        font-size: 24px;
        color: #666;
      }
    }

    .mobile-filter-section {
      margin-top: 20px;

      h2 {
        font-weight: 500;
        font-size: 16px;
      }
    }

    .sort-options {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 12px;
      margin-bottom: 15px;
    }

    .mobile-sidebar {
      display: block;
      height: 500px !important;
    }

    :deep(.el-scrollbar__wrap) {
      height: 200px;
    }
  }
}

.filter-sidebar__overlay {
  visibility: hidden;
  opacity: 0;
  @media (max-width: 1200px) {
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

@media (max-width: 380px) {
  .sort-label {
    font-size: 13px;
    padding: 3px;
  }
}

.confirm-container {
  display: none;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;

  &.active {
    display: flex;
    justify-content: center;
    background-color: #fff;
    bottom: 0;
    right: 0;
    padding: 6px 0;


    .user-btn {
      padding: 6px 12px;
      margin: 0 auto;
    }
  }
}
</style>
