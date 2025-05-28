<template>
  <div class="sidebar-container">
    <div class="sidebar no-responsive">
      <!-- Danh mục -->
      <div class="sidebar__item">
        <div class="sidebar__item--title">
          <el-icon class="sidebar-icon">
            <Grid/>
          </el-icon>
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
                  :ref="el => category.slug === selectedCategory ? activeCategoryRef = el : null"
                  :class="{ 'active': selectedCategory === category.slug }"
                >
                  <input
                    :checked="selectedCategory === category.slug"
                    :value="category.slug"
                    type="checkbox"
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
          <el-icon class="sidebar-icon">
            <StarFilled/>
          </el-icon>
          <span>Tác giả</span>
        </div>
        <div class="sidebar__item--content">
          <el-scrollbar height="400px">
            <ul>
              <li v-for="author in bookStore.authors" :key="author.id">
                <label :class="{ 'active': selectedAuthor === author.slug }">
                  <input
                    :checked="selectedAuthor === author.slug"
                    :value="author.slug"
                    type="checkbox"
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
          <el-icon class="sidebar-icon">
            <HomeFilled/>
          </el-icon>
          <span>Nhà xuất bản</span>
        </div>
        <div class="sidebar__item--content">
          <el-scrollbar height="400px">
            <ul>
              <li v-for="publisher in bookStore.publishers" :key="publisher.id">
                <label :class="{ 'active': selectedPublisher === publisher.slug }">
                  <input
                    :checked="selectedPublisher === publisher.slug"
                    :value="publisher.slug"
                    type="checkbox"
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

    <div class="sidebar responsive">
      <!-- Danh mục -->
      <div class="sidebar__item">
        <div class="sidebar__item--header" @click="toggleContent('category')">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon">
              <Grid/>
            </el-icon>
            <span class="sidebar__item--name">Danh mục</span>
          </div>
          <el-icon :class="{'rotate-180': isContentVisible.category}" class="arrow-down" size="large">
            <ArrowDown/>
          </el-icon>
        </div>
        <transition name="slide">
          <div v-show="isContentVisible.category" class="sidebar__item--content">
            <el-scrollbar ref="scrollbarRef">
              <ul>
                <li
                  v-for="category in bookStore.categories"
                  :key="category.id"
                  ref="categoryRefs"
                >
                  <label
                    :ref="el => category.slug === selectedCategory ? activeCategoryRef = el : null"
                    :class="{ 'active': selectedCategory === category.slug }"
                  >
                    <input
                      :checked="selectedCategory === category.slug"
                      :value="category.slug"
                      type="checkbox"
                      @change="toggleFilter('category', category.slug)"
                    />
                    {{ category.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </transition>
      </div>

      <!-- Tác giả -->
      <div class="sidebar__item">
        <div class="sidebar__item--header" @click="toggleContent('author')">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon">
              <StarFilled/>
            </el-icon>
            <span class="sidebar__item--name">Tác giả</span>
          </div>
          <el-icon :class="{'rotate-180': isContentVisible.author}" class="arrow-down" size="large">
            <ArrowDown/>
          </el-icon>
        </div>
        <transition name="slide">
          <div v-show="isContentVisible.author" class="sidebar__item--content">
            <el-scrollbar>
              <ul>
                <li v-for="author in bookStore.authors" :key="author.id">
                  <label :class="{ 'active': selectedAuthor === author.slug }">
                    <input
                      :checked="selectedAuthor === author.slug"
                      :value="author.slug"
                      type="checkbox"
                      @change="toggleFilter('author', author.slug)"
                    />
                    {{ author.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </transition>
      </div>

      <!-- Nhà xuất bản -->
      <div class="sidebar__item">
        <div class="sidebar__item--header" @click="toggleContent('publisher')">
          <div class="sidebar__item--title">
            <el-icon class="sidebar-icon">
              <HomeFilled/>
            </el-icon>
            <span class="sidebar__item--name">Nhà xuất bản</span>
          </div>
          <el-icon :class="{'rotate-180': isContentVisible.publisher}" class="arrow-down" size="large">
            <ArrowDown/>
          </el-icon>
        </div>
        <transition name="slide">
          <div v-show="isContentVisible.publisher" class="sidebar__item--content">
            <el-scrollbar>
              <ul>
                <li v-for="publisher in bookStore.publishers" :key="publisher.id">
                  <label :class="{ 'active': selectedPublisher === publisher.slug }">
                    <input
                      :checked="selectedPublisher === publisher.slug"
                      :value="publisher.slug"
                      type="checkbox"
                      @change="toggleFilter('publisher', publisher.slug)"
                    />
                    {{ publisher.name }}
                  </label>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useBookStore} from "@/stores/User/book.store";

const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();

const selectedCategory = ref<string | null>(null);
const selectedAuthor = ref<string | null>(null);
const selectedPublisher = ref<string | null>(null);
const isContentVisible = ref({
  category: false,
  author: false,
  publisher: false,
});
const toggleContent = (type: string) => {
  isContentVisible.value[type] = !isContentVisible.value[type];
};

const scrollbarRef = ref<HTMLElement | null>(null);
const activeCategoryRef = ref<HTMLElement | null>(null);
const firstLoad = ref(true);

const toggleFilter = (type: string, value: string) => {
  const newQuery = {...route.query};

  if (newQuery[type] === value) {
    delete newQuery[type];
  } else {
    newQuery[type] = value;
  }

  router.push({query: newQuery});
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
  &__item {
    margin-bottom: 30px;
    border: 1px solid #ccc;

    &--header {
      display: flex;
      justify-content: space-between;
      padding-right: 10px;

      .arrow-down {
        margin-top: 8px;
        margin-left: 8px;
      }
    }

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
        width: 100%;
        padding: 9px 20px;
      }
    }

    &--content {
      ul {
        list-style: none;
        padding: 0;
        margin-top: 0;

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
            line-height: 20px;
            gap: 10px;
            font-size: 14px;
            padding: 5px;
            border-radius: 5px;
            transition: background-color 0.3s ease, color 0.3s ease;

            input {
              cursor: pointer;
              appearance: none;
              min-width: 17px;
              width: 17px;
              height: 17px;
              flex-shrink: 0;
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
  }
}

.sidebar__item--name {
  width: 35%;
}

.sidebar__item--title {
  width: 100%;
}

.slide-enter-active, .slide-leave-active {
  transition: max-height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.slide-enter-to, .slide-leave-from {
  max-height: 1000px; /* Set closer to actual content height */
  opacity: 1;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .sidebar__item--title {
    font-size: 13px;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .sidebar__item--content ul li label {
    font-size: 13px;
    padding: 3px 0;
  }
}

@media (max-width: 1200px) {
  .sidebar__item {
    .rotate-180 {
      transform: rotate(180deg);
      transition: transform 0.3s ease;
    }
  }
}
</style>
