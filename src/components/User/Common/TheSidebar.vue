<template>
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
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookStore } from "@/stores/User/book.store";

const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();

const selectedCategory = ref<string | null>(null);
const selectedAuthor = ref<string | null>(null);
const selectedPublisher = ref<string | null>(null);

const scrollbarRef = ref<HTMLElement | null>(null);
const activeCategoryRef = ref<HTMLElement | null>(null);
const firstLoad = ref(true);

const toggleFilter = (type: string, value: string) => {
  const newQuery = { ...route.query };

  if (newQuery[type] === value) {
    delete newQuery[type];
  } else {
    newQuery[type] = value;
  }

  router.push({ query: newQuery });
};

watchEffect(() => {
  selectedCategory.value = route.query.category ? route.query.category.toString() : null;
  selectedAuthor.value = route.query.author ? route.query.author.toString() : null;
  selectedPublisher.value = route.query.publisher ? route.query.publisher.toString() : null;
});

const scrollToActiveCategory = () => {
  nextTick(() => {
    if (firstLoad.value && scrollbarRef.value && activeCategoryRef.value) {
      const container = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap');
      const activeElement = activeCategoryRef.value;

      if (container && activeElement) {
        container.scrollTo({
          top: activeElement.offsetTop - container.offsetTop - 50,
          behavior: "smooth"
        });
      }
      firstLoad.value = false;
    }
  });
};

onMounted(async () => {
  await bookStore.fetchCategories();
  await bookStore.fetchAuthors();
  await bookStore.fetchPublishers();
  scrollToActiveCategory();
});

watch(selectedCategory, () => {
  scrollToActiveCategory();
});
</script>


<style lang="scss" scoped>
.sidebar {
  @media (max-width: 768px) {
    display: none;
  }

  &__item {
    margin-bottom: 30px;
    border: 1px solid #ccc;

    &--title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .sidebar-icon {
        padding: 9px;
        background-color: #d5d4d4;
        color: #fff;
      }

      & > span {
        background-color: #eee;
        padding: 9px 20px;
      }
    }

    &--content {
      ul {
        list-style: none;
        padding: 0;

        li {
          list-style: none;
          margin: 1px 15px;
          display: flex;
          align-items: center;
          line-height: 17px;

          label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            padding: 5px;
            border-radius: 5px;
            transition: background-color 0.3s ease, color 0.3s ease;

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
  }
}
</style>
