<template>
  <div class="auth">
    <div class="auth__side-image">
      <img alt="" class="auth__side-image-img" src="@/assets/img/User/auth-side-img.svg"/>
    </div>

    <div class="auth__signup-form">
      <h1 class="auth__title">Tạo tài khoản</h1>
      <h2 class="auth__sub-title">Nhập thông tin của bạn bên dưới</h2>

      <form id="form" @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="form-group">
          <input
            v-model="authStore.name"
            :class="{ error: authStore.errors.name }"
            class="form-input"
            placeholder="Họ và tên"
            type="text"
            @input="validateName"
          />
          <div v-if="authStore.errors.name" class="error-message">{{ authStore.errors.name }}</div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <input
            v-model="authStore.email"
            :class="{ error: authStore.errors.email || authStore.formError }"
            class="form-input"
            placeholder="Email"
            type="text"
            @input="validateEmail"
          />
          <div v-if="authStore.errors.email" class="error-message">{{ authStore.errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <input
            v-model="authStore.password"
            :class="{ error: authStore.errors.password || authStore.formError }"
            class="form-input"
            placeholder="Mật khẩu"
            type="password"
            @input="() => { validatePassword(); validateConfirmPassword(); }"
          />
          <div v-if="authStore.errors.password" class="error-message">{{ authStore.errors.password }}</div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <input
            v-model="confirmPassword"
            :class="{ error: confirmPasswordError }"
            class="form-input"
            placeholder="Xác nhận mật khẩu"
            type="password"
            @input="validateConfirmPassword"
          />
          <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
        </div>

        <div class="btn-group">
          <button :disabled="authStore.loading" class="user-long-btn" type="submit">
            <template v-if="authStore.loading">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px">
                <span>Đang tạo tài khoản...</span>
                <span class="loading-spinner"></span>
              </div>
            </template>
            <template v-else>
              Xác nhận tạo tài khoản
            </template>
          </button>
        </div>
      </form>

      <GoogleLogin :callback="callback" class="gg-login-container" popup-type="TOKEN">
        <button class="user-white-btn">
          <img alt="Google Icon" class="gg-icon" src="@/assets/img/User/google-icon.svg"/>
          <span>Đăng nhập với Google</span>
        </button>
      </GoogleLogin>

      <div class="link-to-login">
        Đã có tài khoản?
        <router-link style="text-decoration: underline; text-underline-offset: 7px; color: #000; font-weight: 500"
                     to="/login">Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useAuthStore} from '@/stores/User/auth.store';
import {loginGoogle} from '@/services/Common/auth';
import {ElNotification} from 'element-plus';
import {useRouter} from 'vue-router';
import type {CallbackTypes} from "vue3-google-login";
import {GoogleLogin} from 'vue3-google-login';
import {notifyError} from "@/composables/notifications";
import {useUserStore} from "@/stores/User/user.store";
import { ref } from "vue";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const confirmPassword = ref('');
const confirmPasswordError = ref('');

const validateConfirmPassword = () => {
  confirmPasswordError.value = '';
  if (confirmPassword.value && confirmPassword.value !== authStore.password) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp';
  }
};

const handleSubmit = () => {
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!confirmPasswordError.value && !authStore.errors.name &&
    !authStore.errors.email && !authStore.errors.password) {
    authStore.signup();
  }
};

const callback: CallbackTypes.TokenResponseCallback = async (response) => {
  console.log("Access token", response.access_token);
  try {
    const googleResponse = await loginGoogle(response.access_token as string);

    if (googleResponse && googleResponse.data.access_token) {
      const jwtToken = googleResponse.data.access_token;

      localStorage.setItem("user_access_token", jwtToken);

      authStore.isLoggedIn = true;

      ElNotification({
        type: 'success',
        message: "Đăng nhập với Google thành công",
        title: 'Thành công'
      });

      await router.push({name: 'homepage'});

      await userStore.fetchUserInfo();

    } else {
      ElNotification({
        type: 'error',
        message: 'Đăng nhập với Google thất bại',
        title: 'Thất bại'
      });
    }
  } catch (e: any) {
    console.log(e);
    if (e.response && e.response.data.error === 'Tài khoản đã bị chặn') {
      notifyError('Tài khoản này đã bị chặn!');
    } else {
      notifyError('Bạn hãy đăng nhập bằng email công ty cấp phát!');
    }
  }
};

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

const validateName = () => {
  authStore.errors.name = '';
  if (!authStore.name.trim()) {
    authStore.errors.name = 'Vui lòng nhập tên';
  }
};
</script>

<style lang="scss" scoped>
.user-white-btn {
  width: 400px;
  margin-top: 0 !important;
}

.auth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;

  @media (max-width: 380px) {
    padding-top: 0;
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

    @media (max-width: 1024px) {
      padding: 0 20px;
      margin-left: -4px;
    }
  }

  &__title {
    font-size: 34px;
    font-weight: 500;
    margin-bottom: 20px;
    font-family: Inter, sans-serif;

    @media (max-width: 380px) {
      font-size: 34px;
    }
  }

  &__sub-title {
    margin-bottom: 30px;
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
    width: 370px;
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

    @media (max-width: 678px) {
      width: 91.5%;
    }
    @media (max-width: 380px) {
      width: 95.5%;
    }

    &:focus {
      border-color: #ff6600;
    }

    &.error {
      border-color: red;
    }
  }

  .error-message {
    margin-top: 5px;
    font-size: 12px;
    color: red;
  }
}

.btn-group {
  button {
    margin: 15px 0;
  }

  @media (max-width: 380px) {
    width: 370px;
    padding: 0;
    margin: 0;
  }

  button:first-of-type {
    margin-top: 40px;
  }
}

.link-to-login {
  text-align: center;
  margin-top: 34px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.gg-icon {
  margin-right: 10px;
}

.gg-login-container {
  width: 370px;
}

.user-white-btn {
  @media (max-width: 380px) {
    width: 100%;
    padding: 10px 12px;
    margin: 0 auto;

    .gg-icon {
      margin-right: 10px;
    }
  }

  &:hover {
    background-color: #f8f8f8;
    color: #000;
    border: 1px solid #000;
  }
}

@media (min-width: 768.2px) and (max-width: 1200px) {
  .user-long-btn, .user-white-btn {
    width: 100%;
  }

  //.form-input {
  //  width: 95.5% !important;
  //}
}

.user-long-btn {
  width: 370px;
  padding: 0;
}

.error-message {
  line-height: 20px !important;
  text-align: left !important;
}
</style>
