<template>
  <div class="profile__breadcrumb">
    <TheBreadCrumb />
    <p class="welcome">Welcome! <span class="profile__breadcrumb--name">{{ userStore.userInfo.full_name}}</span></p>
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
  display: flex;

  @media (max-width: 1200px) {
    flex-direction: column;
    margin-top: 40px;
  }

  &__breadcrumb {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1200px) {
      flex-direction: column;
      align-items: flex-start;
    }

    &--name {
      color: var(--user-theme-color);
    }

    p {
      font-size: 16px;
      @media (max-width: 767px) {
        margin-top: 42px;
      }
    }
  }

  &__sidebar {
    width: 300px;

    @media (max-width: 1200px) {
      width: 100%;
    }

    @media (min-width: 768.2px) and (max-width: 1200px) {
      width: 100%;
      margin-right: 20px;
    }

    &--heading {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;

      @media (max-width: 768px) {
        margin-bottom: 0;
      }
    }

    &--sub-heading {
      font-size: 14px;
      color: #969696;
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      @media (max-width: 1200px) {
        flex-direction: row;
        width: 100%;
        justify-content: center;
        margin-top: 0;
        margin-bottom: 20px;
        gap: 30px;
      }

      .sub-heading__item {
        margin-left: 30px;
        margin-top: 20px;
        @media (max-width: 768px) {
          margin-left: 0;
        }
      }
    }
  }

  &__content {
    width: calc(100% - 300px);

    @media (max-width: 768px) {
      width: 100%;
    }

    @media (min-width: 768.2px) and (max-width: 1200px) {
      width: 100%;
    }
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

@media (min-width: 1440px) {
  .profile {
    width: 1170px;
  }
}

.profile {
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 700px !important;
  }

  @media (min-width: 1024px) and (max-width: 1200px) {
    width: 800px !important;
  }
}
</style>
