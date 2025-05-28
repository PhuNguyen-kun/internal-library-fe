<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header__container">
        <div class="header__announcement">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <a class="shop-now" href="#">ShopNow</a>
        </div>

        <div class="header__content">
          <div style="display: flex; gap: 52px; align-items: center">
            <div class="hamburger-menu" @click="toggleMenu">
              <img alt="Menu" src="@/assets/img/User/menu-icon.svg">
            </div>

            <router-link class="header__logo" to="/">
              Kiai Library
            </router-link>
          </div>

          <nav id="navbar" :class="{ active: isMenuOpen }" class="header__nav" @click="closeMenu">
            <router-link exact-active-class="active-link" to="/">Trang chủ</router-link>
            <router-link exact-active-class="active-link" to="/books" class="for-mobile">Tất cả sách</router-link>
            <router-link exact-active-class="active-link" to="/contact">Liên hệ</router-link>
            <router-link exact-active-class="active-link" to="/about">Về chúng tôi</router-link>
            <router-link v-if="!authStore.isLoggedIn" exact-active-class="active-link" to="/signup">Đăng ký
            </router-link>

            <!-- Mobile Actions -->
            <div
              v-if="authStore.isLoggedIn && !['/signup', '/login'].includes(route.path)"
              class="header__action--mobile"
            >
              <router-link to="/wishlist" @click="closeMenu">
                <el-badge :value="wishlistTotal" :offset="[-7, 3]" class="header__action--icon" color="#FF4500C7">
                  <img alt="" src="@/assets/img/User/wishlist-icon.svg">
                </el-badge>
                <p>Danh sách yêu thích</p>
              </router-link>

              <router-link to="/cart" @click="closeMenu">
                <el-badge :offset="[-3, 6]" :value="cartTotal" class="header__action--icon cart" color="#FF4500C7">
                  <img alt="" src="@/assets/img/User/cart-icon.svg">
                </el-badge>
                <p>Giỏ hàng</p>
              </router-link>
              <div class="header__action--user">
                <div class="header__action--user-each">
                  <img alt="" src="@/assets/img/User/user-icon-white.svg">
                  <router-link to="/profile" @click.prevent>Quản lý tài khoản</router-link>
                </div>
                <div class="header__action--user-each">
                  <img alt="" src="@/assets/img/User/borrow-history-icon.svg">
                  <router-link to="/borrowing-history" @click.prevent>Lịch sử mượn</router-link>
                </div>
                <div @click="logout" class="header__action--user-each">
                  <img alt="" src="@/assets/img/User/logout-icon.svg">
                  <a href="#">Đăng xuất</a>
                </div>
              </div>
            </div>
          </nav>
          <div :class="{ active: isMenuOpen }" class="header__nav--overlay" @click="toggleMenu"></div>

          <div class="header__search">
            <input
              v-model="searchTerm"
              class="search-bar"
              placeholder="Tìm kiếm sách theo tiêu đề, tác giả, NXB"
              type="text"
              @keyup.enter="handleSearch"
            />
            <div class="search-icon">
              <img alt="" src="@/assets/img/User/search-icon.svg">
            </div>

            <input
              v-model="searchTerm"
              class="search-bar responsive"
              placeholder="Tìm kiếm sách"
              type="text"
              @keyup.enter="handleSearch"
            />
            <div class="search-icon responsive">
              <img alt="" src="@/assets/img/User/search-icon.svg">
            </div>

            <div v-if="authStore.isLoggedIn && !['/signup', '/login'].includes(route.path)" class="header__action">
              <el-badge :value="wishlistTotal" class="header__action--icon" color="#FF4500C7">
                <router-link to="/wishlist"><img alt="" src="@/assets/img/User/wishlist-icon.svg"></router-link>
              </el-badge>
              <el-badge :offset="[-3, 6]" :value="cartTotal" class="header__action--icon" color="#FF4500C7">
                <router-link to="/cart"><img alt="" src="@/assets/img/User/cart-icon.svg"></router-link>
              </el-badge>
              <div :class="{ active: isDropdownActive }"
                   class="header__action--icon user-icon"
                   @click="toggleDropdown"
              >
                <img alt="" class="user-icon__img" src="@/assets/img/User/user-icon.svg">
                <div v-if="isDropdownActive" class="dropdown-menu">
                  <ul>
                    <li>
                      <img alt="" src="@/assets/img/User/user-icon-white.svg">
                      <router-link to="/profile">Quản lý tài khoản</router-link>
                    </li>
                    <li>
                      <img alt="" src="@/assets/img/User/borrow-history-icon.svg">
                      <router-link to="/borrowing-history" @click.prevent>Lịch sử mượn</router-link>
                    </li>
                    <li @click="logout">
                      <img alt="" src="@/assets/img/User/logout-icon.svg">
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
        <RouterView/>
        <div :class="{ 'visible': isVisible }" :style="{ bottom: `${buttonBottom}px` }" class="to-top-btn"
             @click="scrollToTop">
          <img alt="" src="@/assets/img/User/totop-btn.svg">
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
                :suffix-icon="SendIcon"
                class="input-email"
                placeholder="Enter your email"
                style="width: 200px; border: 1px solid #fff; border-radius: 5px;"
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
            <h3>Download App</h3>

            <p>Save $3 with App New User Only</p>

            <img src="@/assets/img/User/download-app.svg" alt="">

            <div class="icon-socials">
              <a href="#"
              ><img alt="" height="24" src="@/assets/img/User/Icon-Facebook.png" width="24"
              /></a>
              <a href="#"
              ><img alt="" height="24" src="@/assets/img/User/Icon-Twitter.png" width="24"
              /></a>
              <a href="#"
              ><img alt="" height="24" src="@/assets/img/User/icon-instagram.png" width="24"
              /></a>
              <a href="#"
              ><img alt="" height="24" src="@/assets/img/User/Icon-Linkedin.png" width="24"
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
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import SendIcon from "@/components/User/Icons/SendIcon.vue";
import {useRoute, useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/User/auth.store';
import {useCartStore} from '@/stores/User/cart.store';
import {useWishlistStore} from "@/stores/User/wishlist.store";

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const route = useRoute();
const router = useRouter();
const isDropdownActive = ref(false);
const searchTerm = ref("");
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const cartTotal = computed(() => {
  return cartStore.cart.reduce((acc, item) => acc + item.quantity, 0);
});

const wishlistTotal = computed(() => {
  return wishlistStore.wishlists.length;
});

const handleSearch = () => {
  const newQuery = {...route.query};

  if (searchTerm.value.trim() === "") {
    delete newQuery.search_term;
  } else {
    newQuery.search_term = searchTerm.value.trim();
  }

  router.push({path: "/books", query: newQuery});
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

const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
};

watch(() => authStore.isLoggedIn, async (newVal) => {
  if (newVal) {
    await cartStore.fetchCart();
    await wishlistStore.fetchWishlists();
  }
});

watch(() => route.path, (newPath) => {
  if (newPath !== '/books') {
    searchTerm.value = '';
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

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

:deep(.el-main) {
  padding: 0;
}

.main {
  //padding: 113px 250px 70px 250px;
  padding-top: 113px;
  padding-bottom: 70px;
  max-width: 1170px;
  margin: 0 auto;
  overflow-y: hidden;

  @media (min-width: 1439px) {
    width: 1170px;
  }

  @media (max-width: 430px) {
    max-width: 430px;
    min-width: 430px;
  }
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
    border-bottom: 1px solid #ddd;
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
    padding: 18px;
    max-width: 1170px;
    margin: 0 auto;

    @media (max-width: 430px) {
      max-width: 430px;
    }
    @media (max-width: 414px) {
      max-width: 414px;
    }
  }

  &__logo {
    font-size: 24px;
    font-weight: 700;
    font-family: Inter, sans-serif;
    color: #000;

    @media (max-width: 1200px) {
      color: var(--user-theme-color);
    }
  }

  &__nav {
    display: flex;
    gap: 48px;
    margin-left: 100px;

    @media (max-width: 1400px) {
      transform: translateX(-100%);
      transition: transform 0.2s ease;
      padding: 20px;
      top: 0;
      left: 0;
      height: 100vh;
      background: white;

      &.active {
        transform: translateX(0);
      }
    }

    @media (max-width: 992px) {
      transform: translateX(-100%);
      transition: transform 0.2s ease;
      padding: 20px;
      top: 0;
      left: 0;
      height: 100vh;
      background: white;

      &.active {
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      transform: translateX(-100%);
      transition: transform 0.2s ease;
      padding: 20px;
      top: 0;
      left: 0;
      height: 100vh;
      background: white;

      &.active {
        transform: translateX(0);
      }
    }
    @media (max-width: 400px) {
      padding: 10px 0 10px 10px;
      width: 230px !important;
      font-size: 10px;
    }

    &--overlay {
      visibility: hidden;
      opacity: 0;
      @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        transition: opacity 0.3s;
        opacity: 0;
        visibility: hidden;

        &.active {
          opacity: 1;
          visibility: visible;
        }
      }

      @media (max-width: 992px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        transition: opacity 0.3s;
        opacity: 0;
        visibility: hidden;

        &.active {
          opacity: 1;
          visibility: visible;
        }
      }

      @media (max-width: 1400px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        transition: opacity 0.3s;
        opacity: 0;
        visibility: hidden;

        &.active {
          opacity: 1;
          visibility: visible;
        }
      }
    }

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
      border: none;
      border-radius: 5px;
      padding: 10px 33px 10px 15px;
      background-color: #F5F5F5;
      width: 270px;
      font-family: Poppins, sans-serif;
      font-size: 12.5px;

      @media (max-width: 568px) {
        width: 40% !important;
        margin-left: -150px;
      }
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
  //padding: 0 250px;


  .container {
    display: flex;
    justify-content: space-between;
    gap: 87px;
    padding-top: 80px;
    padding-bottom: 60px;
    max-width: 1170px;
    margin: 0 auto;
    flex-wrap: wrap;

    @media (min-width: 768px) and (max-width: 1024px) {
      justify-content: start;
      padding-left: 40px;
    }
  }

  h3 {
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    white-space: nowrap;
    padding-bottom: 12px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      padding-bottom: 16px;

      a {
        font-size: 14px;
        font-style: normal;
        font-weight: 300;
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
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 1.15px;
}

.logo p:nth-child(2) {
  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  padding-top: 24px;
}

.logo p:nth-child(3) {
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
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

  p {
    color: #FAFAFA;
    opacity: 70%;
    font-size: 12px;
    margin-bottom: 8px;

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

//Responsive
.responsive-header {
  display: none;
}

.responsive {
  display: none;
}

.hamburger-menu {
  display: none;
}

.header__action--mobile {
  display: none;
}

// Tablet
@media (max-width: 1400px) {
  .main {
    padding: 113px 35px 70px 35px !important;
  }

  //.footer .container {
  //  flex-direction: column;
  //  gap: 40px;
  //}
  //
  //.footer {
  //  width: 100% !important;
  //  padding: 20px !important;
  //}

  .header__announcement {
    display: none;
  }

  .hamburger-menu {
    display: block;
  }

  .hamburger-menu {
    img {
      width: 27px;
      height: 27px;
    }
  }

  .header__content {
    display: flex;
    padding: 12px 35px;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    //width: 100% !important;

    .header__logo {
      font-size: 21px;
      margin-left: -40px;
    }

    .header__search {
      .search-bar {
        width: 100%;
        margin-left: -10px;
        display: none;
      }

      .responsive {
        display: block;
      }

      .search-icon {
        left: 158px;
      }
    }
  }
  .header__action {
    display: none;
  }

  .header__nav {
    position: fixed;
    inset: 0 50% 0 0;
    width: 400px;
    background-color: #fff;
    z-index: 999;
    flex-direction: column;
    gap: 20px;
    margin-left: 0;

    @media (max-width: 430px) {
      min-height: 900px;
    }

    a {
      font-size: 16px;
      font-weight: 500;
      margin-top: 15px;
      display: flex;
      gap: 20px;

      @media (max-width: 992px) {
        gap: 12px;
      }

      @media (max-width: 400px) {
        font-size: 14px !important;
        margin-top: 10px !important;
      }
    }
  }

  .header__action--mobile {
    display: flex;
    flex-direction: column;
    gap: 25px;
    border-top: 1px solid #ccc;
    margin-top: 20px;
    padding-top: 40px;
  }

  .header__action--icon:nth-of-type(2) {
    margin-left: -5px;
  }

  .cart {
    margin-left: -5px !important;
    margin-right: 5px;
  }
  .header__action--icon {
    width: 30px;
  }
  .header__action--user {
    border-top: 1px solid #ccc;
    padding-top: 25px;
    margin-top: 10px;
  }
}


@media (max-width: 992px) {
  .main {
    padding: 113px 35px 70px 35px !important;
  }

  //.footer .container {
  //  flex-direction: column;
  //  gap: 40px;
  //}
  //
  //.footer {
  //  width: 100% !important;
  //  padding: 20px !important;
  //}

  .header__announcement {
    display: none;
  }

  .hamburger-menu {
    display: block;
  }

  .hamburger-menu {
    img {
      width: 27px;
      height: 27px;
    }
  }

  .header__content {
    display: flex;
    padding: 12px 35px;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    //width: 100% !important;

    .header__logo {
      font-size: 21px;
      margin-left: -40px;
    }

    .header__search {
      .search-bar {
        width: 100%;
        margin-left: -10px;
        display: none;
      }

      .responsive {
        display: block;
      }

      .search-icon {
        left: 158px;
      }
    }
  }
  .header__action {
    display: none;
  }

  .header__nav {
    //display: none;
    position: fixed;
    inset: 0 50% 0 0;
    width: 350px;
    background-color: #fff;
    z-index: 999;
    flex-direction: column;
    gap: 20px;
    margin-left: 0;

    a {
      font-size: 16px;
      font-weight: 500;
      margin-top: 15px;
      display: flex;
      gap: 20px;

      @media (max-width: 992px) {
        gap: 12px;
      }
    }
  }

  .header__action--mobile {
    display: flex;
    flex-direction: column;
    gap: 25px;
    border-top: 1px solid #ccc;
    margin-top: 20px;
    padding-top: 40px;
  }

  .header__action--icon:nth-of-type(2) {
    margin-left: -5px;
  }

  .cart {
    margin-left: -5px !important;
    margin-right: 5px;
  }
  .header__action--icon {
    width: 30px;
  }
  .header__action--user {
    border-top: 1px solid #ccc;
    padding-top: 25px;
    margin-top: 10px;
  }

  .to-top-btn {
    display: none;
  }

  .product-card {
  }
}

@media (max-width: 768px) {
  .common-layout {
    width: 100% !important;
  }
  //.header__container {
  //  width: 100%;
  //}
  .main {
    padding: 113px 13px 70px 13px !important;
  }
  //.footer .container {
  //  flex-direction: column;
  //  gap: 40px;
  //}
  //
  //.footer {
  //  width: 100% !important;
  //  padding: 20px !important;
  //}

  .header__announcement {
    display: none;
  }

  .hamburger-menu {
    display: block;
  }

  .to-top-btn {
    display: none;
  }

  .header__content {
    display: flex;
    padding: 12px 10px;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    //width: 100% !important;

    .header__logo {
      font-size: 21px;
      margin-left: -40px;
    }

    .header__search {
      .search-bar {
        width: 100%;
        margin-left: -10px;
        display: none;
      }

      .responsive {
        display: block;
      }

      .search-icon {
        left: 158px;
      }
    }

    .header__action {
      display: none;
    }

    .header__nav {
      //display: none;
      position: fixed;
      inset: 0 50% 0 0;
      width: 250px;
      background-color: #fff;
      z-index: 999;
      flex-direction: column;
      gap: 20px;
      margin-left: 0;

      a {
        font-size: 16px;
        font-weight: 500;
        margin-top: 15px;
        display: flex;
        gap: 20px;

        @media (max-width: 400px) {
          gap: 12px;
        }
      }
    }
  }

  .hamburger-menu {
    img {
      width: 27px;
      height: 27px;
    }
  }

  .header__action--mobile {
    display: flex;
    flex-direction: column;
    gap: 25px;
    border-top: 1px solid #ccc;
    margin-top: 20px;
    padding-top: 40px;
  }
  .header__action--icon:nth-of-type(2) {
    margin-left: -5px;
  }
  .cart {
    margin-left: -5px !important;
    margin-right: 5px;
  }
  .header__action--icon {
    width: 30px;
  }
  .header__action--user {
    border-top: 1px solid #ccc;
    padding-top: 25px;
    margin-top: 10px;
  }
  .header__action--user-each {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 14px;

    @media (max-width: 400px) {
      gap: 8px;
    }

    a {
      margin-bottom: 14px;
    }

    img {
      width: 27px;
      margin-right: 10px;

      filter: invert(1);
    }
  }
}

@media (max-width: 1400px) {
  .header__search {
    width: 65%;
    margin-left: -295px;
    display: flex;
    .search-bar {
      width: 100% !important;
      margin-left: 60px !important;
      left: 0;
      padding: 7px !important;
    }
  }

  .header__action--user-each {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 14px;

    @media (max-width: 400px) {
      gap: 8px;
    }

    a {
      margin-bottom: 14px;
    }

    img {
      width: 27px;
      margin-right: 10px;

      filter: invert(1);
    }
  }
}

@media (max-width: 1400px) {
  .search-icon {
    left: 95% !important;
  }
}
@media (max-width: 1200px) {
  .search-icon {
    left: 94% !important;
  }
}
@media (max-width: 992px) {
  .search-icon {
    left: 92% !important;
  }
}
@media (max-width: 700px) {
  .search-icon {
    left: 90% !important;
  }
}
@media (max-width: 567px) {
  .search-icon {
    left: 88% !important;
  }
}
@media (max-width: 475px) {
  .search-icon {
    left: 86% !important;
  }
}

@media (max-width: 380px) {
  .a {
    font-size: 2px !important;
  }
  .search-icon {
    left: 84% !important;
  }

  .header__action--mobile {
    padding-top: 30px;
    gap: 15px;
  }

  .header__action--user-each {
    margin-bottom: 12px;
  }
}

:deep(.el-input__inner) {
  height: 20px;
  &::placeholder {
    color: #FAFAFA;
    opacity: 40%;
  }
}

@media (max-width: 430px) {
  .footer .container {
    flex-direction: column;
    gap: 40px;
  }

  .footer {
    width: 100% !important;
    padding: 20px !important;
  }
}
</style>
