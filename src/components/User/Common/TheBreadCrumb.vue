<template>
  <div class="layout">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <router-link v-if="item.link" :to="item.link">{{ item.text }}</router-link>
        <span v-else :title="item.text" class="breadcrumb-text">{{ item.text }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore} from "@/stores/User/book.store";
import { ref, watch } from 'vue'

const bookStore = useBookStore();
const bookTitle = ref("");
const routeToVietnameseMap: Record<string, string> = {
  user: 'Trang chủ',
  login: 'Đăng nhập',
  'book-detail': 'Chi tiết hàng',
  cart: 'Giỏ hàng',
  checkout: 'Xác nhận mượn sách',
  register: 'Đăng ký',
  books: 'Sách',
  wishlist: 'Danh sách yêu thích',
  'my-profile': 'Hồ sơ của tôi',
  'borrowing-history': 'Lịch sử mượn',
  'account-manage': 'Quản lý tài khoản',
  'edit-profile': 'Chỉnh sửa hồ sơ',
  'change-password': 'Đổi mật khẩu',
  'order-list': 'Danh sách đơn mua',
  'order-detail': 'Chi tiết đơn mua',
  'profile': 'Hồ sơ',
  'forgot-password': 'Quên mật khẩu',
  'reset-password': 'Reset mật khẩu',
  'contact': 'Liên hệ',
  'about': 'Về chúng tôi',
}

const route = useRoute()

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

watch(
  () => bookStore.book,
  (book) => {
    if (book) {
      bookTitle.value = book.title;
    }
  },
  { immediate: true }
);

const breadcrumbItems = computed(() => {
  const items = route.matched.map((matchedRoute) => {
    const routeName = matchedRoute.name as string;
    const translatedText = routeToVietnameseMap[routeName] || capitalizeWords(routeName);

    if (routeName === "book-detail" && bookTitle.value) {
      return {
        text: bookTitle.value,
        link: null,
      };
    }

    return {
      text: translatedText,
      link: matchedRoute.path !== route.path ? matchedRoute.path : null,
    };
  });

  if (route.name === "book-detail" && !items.some(item => item.text === "Sách")) {
    items.splice(items.length - 1, 0, { text: "Sách", link: "/books" });
  }

  if (route.name === "profile") {
    return items.filter((item, index, self) => {
      return index === self.findIndex((t) => t.text === item.text);
    });
  }

  return items;
});
</script>

<style lang="scss" scoped>
.layout {
  padding-top: 40px;
  border: none !important;

  @media (max-width: 1200px) {
    padding-top: 0;
    margin-top: -20px;
  }
}
a {
  &:hover {
    color: var(--user-theme-color);
  }
}
:deep(.el-breadcrumb__inner) {
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3125rem;
  a {
    font-weight: 400;
  }
}

.breadcrumb-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: 3em;
  line-height: 1.5em;
}

.el-breadcrumb {
  @media (min-width: 768px) {
    margin-top: 20px;
    margin-bottom: 60px;
  }
}
</style>
