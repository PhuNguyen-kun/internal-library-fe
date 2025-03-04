<template>
  <div class="auth">
    <div class="auth__side-image">
      <img src="@/assets/img/User/auth-side-img.svg" alt="">
    </div>

    <div class="auth__signup-form">
      <h1 class="auth__title">Reset Password</h1>

      <form @submit.prevent="submit">
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu mới"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <input
            v-model="passwordConfirmation"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            class="form-input"
          />
        </div>

        <div class="error-message" v-if="error">{{ error }}</div>

        <div class="btn-group">
          <button type="submit" class="user-btn" :disabled="loading">
            <template v-if="loading">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px">
                <span>Xác nhận mật khẩu mới</span>
                <span class="loading-spinner"></span>
              </div>
            </template>
            <template v-else>
              Xác nhận mật khẩu mới
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/utils/axiosInstance';
import { useRoute, useRouter } from 'vue-router';
import {notifyError, notifySuccess} from "@/composables/notifications";

const route = useRoute();
const router = useRouter();
const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');
const loading = ref(false);

const token = ref(route.query.token as string);
const email = ref(route.query.email as string);

onMounted(() => {
  token.value = route.query.token as string;
  email.value = route.query.email as string;
});

const submit = async () => {
  try {
    if (password.value !== passwordConfirmation.value) {
      error.value = 'Mật khẩu không trùng lặp';
      return;
    }

    loading.value = true;

    const response = await axios.post('/auth/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    });

    if (response.data.message === "This password reset token is invalid.") {
      notifyError('Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.');
      router.push('/forgot-password');
    } else {
      notifySuccess('Đặt lại mật khẩu thành công!');
      router.push('/login');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Mật khẩu phải có ít nhất 8 ký tự!';

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
