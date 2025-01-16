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
            <router-link to="/">Home</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/signup">Sign up</router-link>
          </nav>

          <div class="header__search">
            <input
              type="text"
              class="search-bar"
              placeholder="Bạn cần tìm gì hôm nay?"
            />
            <div class="search-icon">
              <img src="@/assets/img/User/search-icon.svg" alt="">
            </div>

            <img src="@/assets/img/User/wishlist-icon.svg" alt="">
            <img src="@/assets/img/User/cart-icon.svg" alt="">
          </div>
        </div>
      </el-header>

      <el-main class="main">
        <RouterView />
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
import SendIcon from "@/components/User/Icons/SendIcon.vue";
</script>

<style lang="scss" scoped>
.main {
  padding: 113px 250px;
  overflow-y: hidden
}

.header {
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
      }
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
      width: 200px;
      font-family: Poppins, sans-serif;
    }

    .search-icon {
      position: absolute;
      margin-left: 10px;
      left: 210px;
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
    gap: 5.438rem;
    padding-top: 5rem;
    padding-bottom: 3.75rem;
  }

  h3 {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: #fff;
    white-space: nowrap;
    padding-bottom: 1.5rem;
  }
  ul {
    list-style-type: none;
    padding: 0;
    li {
      padding-bottom: 1rem;
      a {
        font-size: 16px;
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
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.72px;
}

.logo p:nth-child(2) {
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  padding-top: 1.5rem;
}

.logo p:nth-child(3) {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
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
    width: 13.5625rem;
    padding: 0.75rem 0rem 0.75rem 1rem;
    align-items: center;
    padding-right: 1.2rem;
  }
}
.icon-socials {
  display: flex;
  gap: 1.5rem;
  padding-top: 1.5rem;
}
.input-email ::placeholder {
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
      padding-right: 7rem;
    }
    .download-app {
      width: 50%;
      flex: 1;
    }
  }
  .logo p:nth-child(1) {
    font-size: 20px;
  }
  .logo p:nth-child(2) {
    font-size: 16px;
  }
  .logo p:nth-child(3) {
    font-size: 12px;
  }
  .download-app span {
    font-size: 10px;
  }
  .icon-socials {
    gap: 1rem;
  }
  .input-email {
    :deep(.el-input__wrapper) {
      display: flex;
      width: 13.5625rem;
      padding: 0.75rem 0rem 0.75rem 1rem;
      align-items: center;
      gap: 2rem;
    }
  }
  .download {
    gap: 4px;
  }
  .icon-app {
    gap: 4px;
  }
  .icon-socials {
    gap: 1rem;
  }
  .subscribe-box {
    padding-top: 1rem;
  }
  :deep(.el-input) {
    width: 150px;
  }
}
@media (max-width: 480px) {
  .container {
    flex-direction: column;
    gap: 2rem;
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
