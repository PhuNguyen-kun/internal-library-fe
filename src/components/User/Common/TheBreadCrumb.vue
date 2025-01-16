<template>
  <div class="layout">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <router-link v-if="item.link" :to="item.link">{{ item.text }}</router-link>
        <span v-else>{{ item.text }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const routeToVietnameseMap: Record<string, string> = {
  user: 'Trang chủ',
  login: 'Đăng nhập',
  'book-detail': 'Chi tiết hàng',
  cart: 'Giỏ mua',
  checkout: 'Xác nhận mua hàng',
  register: 'Đăng ký',
  booklist: 'Tất cả mặt hàng',
  wishlist: 'Danh sách yêu thích',
  'account-manage': 'Quản lý tài khoản',
  'edit-profile': 'Chỉnh sửa hồ sơ',
  'change-password': 'Đổi mật khẩu',
  'order-list': 'Danh sách đơn mua',
  'order-detail': 'Chi tiết đơn mua'
}

const route = useRoute()

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const bookTitle = computed(() => {
  if (route.name === 'book-detail' && route.params.slug) {
    return capitalizeWords(decodeURIComponent(route.params.slug as string).replace(/-/g, ' '))
  }
  return null
})

const breadcrumbItems = computed(() => {
  return route.matched.map((matchedRoute) => {
    const routeName = matchedRoute.name as string
    const translatedText = routeToVietnameseMap[routeName] || capitalizeWords(routeName)

    if (routeName === 'book-detail' && bookTitle.value) {
      return {
        text: bookTitle.value,
        link: null
      }
    }

    return {
      text: translatedText,
      link: matchedRoute.path !== route.path ? matchedRoute.path : null
    }
  })
})
</script>

<style lang="scss" scoped>
.layout {
  padding-top: 40px;
  border: none !important;
}
a {
  &:hover {
    color: var(--primary-color);
  }
}
:deep(.el-breadcrumb__inner) {
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3125rem;
}
</style>
