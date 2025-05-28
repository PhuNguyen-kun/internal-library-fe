<template>
  <div class="auth">
    <div class="auth__side-image">
      <img src="@/assets/img/User/auth-side-img.svg" alt="">
    </div>

    <div class="auth__signup-form">
      <h1 class="auth__title">Đăng nhập Kiai Library</h1>
      <h2 class="auth__sub-title">Điền thông tin của bạn bên dưới</h2>

      <form @submit.prevent="authStore.login" id="form">
        <!-- Email -->
        <div class="form-group">
          <!--          <div class="label">Email address</div>-->
          <input
            v-model="authStore.email"
            type="text"
            placeholder="Email"
            class="form-input"
            :class="{ error: authStore.errors.email || authStore.formError }"
            @input="validateEmail"
          />
          <div class="error-message" v-if="authStore.errors.email">{{ authStore.errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <!--          <div class="label">Password</div>-->
          <input
            v-model="authStore.password"
            type="password"
            placeholder="Mật khẩu"
            class="form-input"
            :class="{ error: authStore.errors.password || authStore.formError }"
            @input="validatePassword"
          />
          <div class="error-message" v-if="authStore.errors.password">{{ authStore.errors.password }}</div>
        </div>

        <div class="error-message" v-if="authStore.formError" style="text-align: center">{{ authStore.formError }}</div>

        <div class="btn-group">
          <button type="submit" class="user-btn" :disabled="authStore.loading">
            <template v-if="authStore.loading">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px">
                <span>Đang đăng nhập...</span>
                <span class="loading-spinner"></span>
              </div>
            </template>
            <template v-else>
              Đăng nhập
            </template>
          </button>

          <div>
            <router-link to="/forgot-password" class="forgot-password">Quên mật khẩu?</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/User/auth.store';

const authStore = useAuthStore();

const validateEmail = () => {
  authStore.errors.email = '';
  if (!authStore.isValidEmail(authStore.email)) {
    authStore.errors.email = 'Email có hậu tố "@kiaisoft.com" hoặc tiền tố "kiaisoft"';
  }
};

const validatePassword = () => {
  authStore.errors.password = '';
  if (authStore.password.length < 8) {
    authStore.errors.password = 'Mật khẩu ít nhất 8 ký tự';
  }
};
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;

  @media (max-width: 380px) {
    padding: 20px 0 0 0;
  }

  &__side-image {
    flex: 2;

    @media (max-width: 1200px) {
      display: none;
    }

    img {
      width: 90%;
    }
  }

  &__signup-form {
    flex: 1;
    padding: 0 0 0 40px;

      @media (max-width: 768px) {
        padding: 0 20px;
      }

      @media (max-width: 380px) {
        padding: 0 5px !important;
      }
  }

  &__title {
    font-size: 34px;
    font-weight: 500;
    line-height: 43px;
    margin-bottom: 20px;
    font-family: Inter, sans-serif;
    @media (max-width: 380px) {
      font-size: 34px;
      line-height: 47px;
    }
  }

  &__sub-title {
    margin-bottom: 40px;
    font-weight: 400;
  }
}

.form-group {
  margin-bottom: 20px;

  .label {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    font-weight: 500;
    display: block;
  }

  .form-input {
    width: 100%;
    padding: 17px 0 17px 0;
    border: none;
    border-bottom: 1px solid #000;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    position: relative;

    &::placeholder {
      //position: absolute;
      //top: 50%;
      //left: 0;
      //transform: translateY(-50%);
      //font-size: 16px;
      //transition: all 0.3s ease;
      color: #aaa;
    }
  }
}

.error-message {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: red;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin: 30px 0;
  }

  .forgot-password {
    color: #DB4444;

    &:hover {
      color: var(--user-theme-color);
    }
  }
}


.loading-spinner {
  border: 2px solid var(--user-theme-color);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

//.auth__signup-form {
//  margin-top: 190px !important;
//}
//
//.auth {
//  margin-bottom: 326px !important;
//}

.error-message {
  line-height: 20px !important;
  text-align: left !important;
}
</style>
