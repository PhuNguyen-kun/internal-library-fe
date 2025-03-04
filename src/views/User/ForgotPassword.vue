<template>
  <div class="auth">
    <div class="auth__side-image">
      <img src="@/assets/img/User/auth-side-img.svg" alt="">
    </div>

    <div class="auth__signup-form">
      <h1 class="auth__title">Nhập email của bạn</h1>

      <form @submit.prevent="submit">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="form-input"
            :class="{ error: error }"
          />
          <div class="error-message" v-if="error">{{ error }}</div>
        </div>

        <div class="btn-group">
          <button type="submit" class="user-btn" :disabled="loading">
            <template v-if="loading">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px">
                <span>Gửi link khôi phục</span>
                <span class="loading-spinner"></span>
              </div>
            </template>
            <template v-else>
              Gửi link khôi phục
            </template>
          </button>
          <router-link to="/login" class="back-login no-text-decoration__strong">Quay lại Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/utils/axiosInstance';
import { useRouter } from 'vue-router';
import {notifySuccess} from "@/composables/notifications";

const email = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const submit = async () => {
  try {
    loading.value = true;
    const response = await axios.post('/auth/forgot-password', {
      email: email.value
    });
    console.log(response)

    notifySuccess('Link khôi phục đã được gửi tới Email của bạn!');
    router.push('/login');
  } catch (err: any) {
    error.value = 'Tài khoản không hợp lệ!';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;

  &__side-image {
    flex: 2;
    img {
      width: 90%;
    }
  }

  &__signup-form {
    flex: 1;
    padding: 0 40px;
  }

  &__title {
    font-size: 38px;
    font-weight: 500;
    margin-bottom: 20px;
    font-family: Inter, sans-serif;
  }

  &__sub-title {
    margin-bottom: 50px;
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
    width: 91.5%;
    padding: 17px 15px;
    border: none;
    border-bottom: 1px solid #000;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #ff6600;
    }

    &.error {
      border-color: red;
    }
  }
}

.error-message {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 15px;
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
    color: #000;

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
</style>
