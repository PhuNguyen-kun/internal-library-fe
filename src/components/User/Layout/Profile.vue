<template>
  <div class="profile__breadcrumb">
    <TheBreadCrumb />
    <p>Welcome! <span class="profile__breadcrumb--name">{{ userStore.userInfo.full_name}}</span></p>
  </div>
  <div class="profile">
    <div class="profile__sidebar">
      <h1 class="profile__sidebar--heading">Quản lý tài khoản</h1>
      <div class="profile__sidebar--sub-heading no-text-decoration">
        <router-link to="/profile" class="sub-heading__item" exact-active-class="active-link">Thông tin tài khoản</router-link>
        <router-link to="/change-password" class="sub-heading__item" exact-active-class="active-link">Thay đổi mật khẩu</router-link>
      </div>
    </div>

    <div class="profile__content">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import {useUserStore} from "@/stores/User/user.store";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUserInfo();
});
</script>

<style scoped lang="scss">
.profile {
  margin-top: 70px;
  display: flex;

  &__breadcrumb {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--name {
      color: var(--user-theme-color);
    }

    p {
      font-size: 16px;
      margin-top: 42px;
    }
  }

  &__sidebar {
    width: 300px;
    &--heading {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
    }

    &--sub-heading {
      font-size: 14px;
      color: #969696;
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .sub-heading__item {
        margin-left: 30px;
        margin-top: 20px;
      }
    }
  }

  &__content {
    width: calc(100% - 300px);
  }
}

.no-text-decoration {
  a {
    text-decoration: none;
    color: #000;

    &:hover {
      color: var(--user-theme-color);
    }
  }

  text-decoration: none;
  color: #000;
}

.sub-heading__item.active-link {
  color: var(--user-theme-color) !important;
}
</style>
