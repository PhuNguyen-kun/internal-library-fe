<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header__container">
        <div class="header__announcement">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <a href="#" class="shop-now">ShopNow</a>
        </div>

        <div class="header__content">
          <div class="header__logo">
            Kiai Library
          </div>

          <nav class="header__nav">
            <router-link exact-active-class="active-link" to="/homepage">Home</router-link>
            <router-link exact-active-class="active-link" to="/contact">Contact</router-link>
            <router-link exact-active-class="active-link" to="/about">About</router-link>
            <router-link v-if="!authStore.isLoggedIn" exact-active-class="active-link" to="/signup">Sign up</router-link>
          </nav>

          <div class="header__search">
            <input
              type="text"
              class="search-bar"
              placeholder="Tìm kiếm sách theo tiêu đề, tác giả, NXB"
              v-model="searchTerm"
              @keyup.enter="handleSearch"
            />
            <div class="search-icon">
              <img src="@/assets/img/User/search-icon.svg" alt="">
            </div>

            <div class="header__action" v-if="authStore.isLoggedIn && !['/signup', '/login'].includes(route.path)">
              <el-badge :value="wishlistTotal" color="#FF4500C7" class="header__action--icon">
                <router-link to="/wishlist"><img src="@/assets/img/User/wishlist-icon.svg" alt=""></router-link>
              </el-badge>
              <el-badge :value="cartTotal" :offset="[-3, 6]" color="#FF4500C7" class="header__action--icon" >
                <router-link to="/cart"><img src="@/assets/img/User/cart-icon.svg" alt=""></router-link>
              </el-badge>
              <div class="header__action--icon user-icon"
                   :class="{ active: isDropdownActive }"
                    @click="toggleDropdown"
              >
                <img src="@/assets/img/User/user-icon.svg" alt="" class="user-icon__img">
                <div class="dropdown-menu" v-if="isDropdownActive">
                  <ul>
                    <li>
                      <img src="@/assets/img/User/user-icon-white.svg" alt="">
                      <router-link to="/profile">Quản lý tài khoản</router-link>
                    </li>
                    <li>
                      <img src="@/assets/img/User/borrow-history-icon.svg" alt="">
                      <router-link to="/borrowing-history">Lịch sử mượn</router-link>
                    </li>
                    <li @click="logout">
                      <img src="@/assets/img/User/logout-icon.svg" alt="">
                      <a href="#">Đăng xuất</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="main">
        <RouterView />
        <div class="to-top-btn" :class="{ 'visible': isVisible }" :style="{ bottom: `${buttonBottom}px` }" @click="scrollToTop">
          <img src="@/assets/img/User/totop-btn.svg" alt="">
        </div>
      </el-main>

      <el-footer class="footer">
        <div class="container">
          <div class="logo">
            <p>Kiai Library</p>
            <p>Subscribe</p>
            <p>Get 10% off your first order</p>
            <div class="subscribe-box">
              <el-input
                class="input-email"
                style="width: 217px"
                placeholder="Enter your email"
                :suffix-icon="SendIcon"
              />
            </div>
          </div>
          <div class="support">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/"
                >111 Bijoy sarani, Dhaka,
                  <div>DH 1515, Bangladesh.</div>
                </a>
              </li>
              <li><a href="/">kiailibrary@gmail.com</a></li>
              <li><a href="/">+88015-88888-9999</a></li>
            </ul>
          </div>
          <div class="account">
            <h3>Account</h3>
            <ul>
              <li><a href="/">My Account</a></li>
              <li><a href="/">Login / Register</a></li>
              <li><a href="/">Cart</a></li>
              <li><a href="/">Wishlist</a></li>
              <li><a href="/">Shop</a></li>
            </ul>
          </div>
          <div class="quick-link">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Terms Of Use</a></li>
              <li><a href="/">FAQ</a></li>
              <li><a href="/">Contact</a></li>
            </ul>
          </div>
          <div class="download-app">
            <h3>Social</h3>

            <div class="icon-socials">
              <a href="#"
              ><img src="@/assets/img/User/Icon-Facebook.png" alt="" width="24" height="24"
              /></a>
              <a href="#"
              ><img src="@/assets/img/User/Icon-Twitter.png" alt="" width="24" height="24"
              /></a>
              <a href="#"
              ><img src="@/assets/img/User/icon-instagram.png" alt="" width="24" height="24"
              /></a>
              <a href="#"
              ><img src="@/assets/img/User/Icon-Linkedin.png" alt="" width="24" height="24"
              /></a>
            </div>
          </div>
        </div>
      </el-footer>
      <div class="footer-noti">
        <i class="fa-regular fa-copyright"></i>
        <p>Copyright Rimel 2022. All right reserved</p>
      </div>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SendIcon from "@/components/User/Icons/SendIcon.vue";
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/User/auth.store';
import { useCartStore } from '@/stores/User/cart.store';
import {useWishlistStore} from "@/stores/User/wishlist.store";

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const route = useRoute();
const router = useRouter();
const isDropdownActive = ref(false);
const searchTerm = ref("");

const cartTotal = computed(() => {
  return cartStore.cart.reduce((acc, item) => acc + item.quantity, 0);
});

const wishlistTotal = computed(() => {
  return wishlistStore.wishlists.length;
});

const handleSearch = () => {
  const newQuery = { ...route.query };

  if (searchTerm.value.trim() === "") {
    delete newQuery.search_term;
  } else {
    newQuery.search_term = searchTerm.value.trim();
  }

  router.push({ path: "/books", query: newQuery });
};

const toggleDropdown = (event: MouseEvent) => {
  event.stopPropagation();
  isDropdownActive.value = !isDropdownActive.value;
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-icon')) {
    isDropdownActive.value = false;
  }
};

const isVisible = ref(false);
const buttonBottom = ref(20);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const checkScroll = () => {
  isVisible.value = window.scrollY > 200;

  const footer = document.querySelector('.footer');
  if (footer) {
    const footerRect = footer.getBoundingClientRect();
    const buttonHeight = 50;
    const safeDistance = 20;

    if (footerRect.top < window.innerHeight) {
      buttonBottom.value = window.innerHeight - footerRect.top + safeDistance;
    } else {
      buttonBottom.value = 20;
    }
  }
};

const logout = () => {
  authStore.logout();
};

document.addEventListener('click', closeDropdown);

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});

onMounted(async () => {
  await cartStore.fetchCart();
  await wishlistStore.fetchWishlists();
});
</script>

<style lang="scss" scoped>
.to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 120px;
  z-index: 1000;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
  background-color: #F5F5F5;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &:hover {
    background-color: var(--user-theme-color);

    img {
      filter: invert(1);
    }
  }

  &.visible {
    opacity: 1;
    visibility: visible;
  }
}

.main {
  padding: 113px 250px 70px 250px;
  overflow-y: hidden
}

.header {
  &__action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    &--icon {
      cursor: pointer;
    }

    .user-icon {
      position: relative;
      .dropdown-menu {
        display: none;
        position: absolute;
        top: 110%;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(15px);
        border-radius: 10px;
        padding: 15px;
        width: 200px;
        z-index: 100;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 12px 0;
            display: flex;

            &:hover {
              color: #ffffff;
              text-decoration: underline;
              text-underline-offset: 4px;
            }

            img {
              width: 23px;
              margin-right: 10px;
            }

            a {
              text-decoration: none;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              display: flex;
              align-items: center;
              gap: 10px;
            }
          }
        }
      }

      &.active, &:hover {
        border-radius: 999px;
        background-color: var(--user-theme-color);
        transition: 0.3s;

        .user-icon__img {
          width: 22px;
          padding: 5px;
          filter: invert(1);
        }
        .dropdown-menu {
          display: block;
          animation: fadeIn 0.3s ease-in-out;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }

  &__container {
    height: auto;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff;
  }

  &__announcement {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--user-theme-color);
    color: #fff;
    height: 40px;
    font-size: 14px;
    font-weight: 300;

    .shop-now {
      color: #fff;
      font-weight: 600;
      text-decoration: underline;
      margin-left: 10px;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 250px;
    border-bottom: 1px solid #ddd;
  }

  &__logo {
    font-size: 24px;
    font-weight: 700;
    font-family: Inter, sans-serif;
    color: #000;
  }

  &__nav {
    display: flex;
    gap: 50px;

    a {
      text-decoration: none;
      color: #000;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 5px;
      }
    }

    .active-link {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }

  &__search {
    display: flex;
    align-items: center;
    position: relative;
    gap: 25px;

    .search-bar {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 7px 33px 7px 15px;
      background-color: #F5F5F5;
      width: 270px;
      font-family: Poppins, sans-serif;
    }

    .search-icon {
      position: absolute;
      margin-left: 10px;
      left: 280px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }
}

.footer-noti {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #ff9168;
  padding-top: 16px;
  padding-bottom: 24px;
  border-top: 1px solid #ff9168;
  background-color: rgba(255, 69, 0, 0.78);
}
.footer {
  height: fit-content;
  background-color: rgba(255, 69, 0, 0.78);
  bottom: 0;
  width: 100%;
  padding: 0 250px;

  .container {
    display: flex;
    justify-content: space-between;
    gap: 87px;
    padding-top: 80px;
    padding-bottom: 60px;
  }

  h3 {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: #fff;
    white-space: nowrap;
    padding-bottom: 24px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      padding-bottom: 16px;
      a {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        color: #fff;
        text-decoration: none;
        white-space: nowrap;
      }
    }
  }

  ul li:nth-child(5) {
    padding-bottom: 0;
  }
}

.logo p:nth-child(1) {
  color: #fff;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 1.15px;
}

.logo p:nth-child(2) {
  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  padding-top: 24px;
}

.logo p:nth-child(3) {
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  padding-top: 24px;
  padding-bottom: 16px;
}

:deep(.el-input__wrapper) {
  background: var(--user-theme-color);
  background-color: transparent;
}

.download-app {
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: #fff;
  }

  .download {
    padding-top: 10px;
    display: flex;
    gap: 8px;
  }
}

.input-email {
  :deep(.el-input__wrapper) {
    display: flex;
    width: 217px;
    padding: 12px 0 12px 16px;
    align-items: center;
    padding-right: 19px;
  }
}

.icon-socials {
  display: flex;
  gap: 24px;
  padding-top: 24px;
}

.input-email::placeholder {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.icon-app {
  width: min-content;
}

@media (max-width: 1024px) {
  .container {
    flex-wrap: wrap;

    .logo {
      width: 50%;
      flex: 1;
    }

    .support {
      width: 50%;
      flex: 1;
    }

    .account {
      width: 50%;
      flex: 1;
    }

    .quick-link {
      width: 30%;
      flex: 1;
      max-width: fit-content;
      padding-right: 112px;
    }

    .download-app {
      width: 50%;
      flex: 1;
    }
  }

  .logo p:nth-child(1) {
    font-size: 18px;
  }

  .logo p:nth-child(2) {
    font-size: 14px;
  }

  .logo p:nth-child(3) {
    font-size: 10px;
  }

  .download-app span {
    font-size: 8px;
  }

  .icon-socials {
    gap: 16px;
  }

  .input-email {
    :deep(.el-input__wrapper) {
      display: flex;
      width: 217px;
      padding: 12px 0 12px 16px;
      align-items: center;
      gap: 32px;
    }
  }

  .download {
    gap: 4px;
  }

  .icon-app {
    gap: 4px;
  }

  .icon-socials {
    gap: 16px;
  }

  .subscribe-box {
    padding-top: 16px;
  }

  :deep(.el-input) {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .container {
    flex-direction: column;
    gap: 32px;

    .logo {
      width: 100%;
      flex: 1;
    }

    .support {
      width: 100%;
      flex: 1;
    }

    .account {
      width: 100%;
      flex: 1;
    }

    .quick-link {
      width: 100%;
      flex: 1;
      max-width: fit-content;
      padding-right: 0;
    }

    .download-app {
      width: 100%;
      flex: 1;
    }
  }

  .input-email {
    :deep(.el-input__wrapper) {
      padding: 12px;
    }
  }

  .footer-noti {
    font-size: 12px;
  }
}

.common-layout {
  height: 100vh;
}

//responsive for mobile
@media screen and (max-width: 768px) {
  .main {
    padding: 113px 20px;
  }
  .header__content {
    padding: 18px 50px;
  }
  .header__search {
    .search-bar {
      width: 150px;
    }
    .search-icon {
      left: 160px;
    }
  }
  .footer {
    padding: 0 50px;
  }
  .footer h3 {
    font-size: 16px;
  }
  .footer ul li a {
    font-size: 14px;
  }
  .footer-noti {
    font-size: 14px;
  }
}

//responsive for tablet
@media screen and (max-width: 1024px) {
  .main {
    padding: 113px 100px;
  }
  .header__content {
    padding: 18px 100px;
  }
  .footer {
    padding: 0 100px;
  }
}
</style>
