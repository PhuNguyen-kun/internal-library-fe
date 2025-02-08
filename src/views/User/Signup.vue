<template>
  <div class="auth">
    <div class="auth__side-image">
      <img src="@/assets/img/User/auth-side-img.svg" alt="">
    </div>

    <div class="auth__signup-form">
      <h1 class="auth__title">Create an account</h1>
      <h2 class="auth__sub-title">Enter your details below</h2>

      <form @submit.prevent="" id="form">
        <!-- Name -->
        <div class="form-group">
<!--          <div class="label">Name</div>-->
          <input
            v-model="authStore.name"
            type="text"
            placeholder="Name"
            class="form-input"
            @input="authStore.validateForm"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
<!--          <div class="label">Email address</div>-->
          <input
            v-model="authStore.email"
            type="text"
            placeholder="Email"
            class="form-input"
            :class="{ error: authStore.errors.email || authStore.formError }"
            @input="authStore.validateForm"
          />
          <div class="error-message" v-if="authStore.errors.email">{{ authStore.errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="form-group">
<!--          <div class="label">Password</div>-->
          <input
            v-model="authStore.password"
            type="password"
            placeholder="Password"
            class="form-input"
            :class="{ error: authStore.errors.password || authStore.formError }"
            @input="authStore.validateForm"
          />
          <div class="error-message" v-if="authStore.errors.password">{{ authStore.errors.password }}</div>
        </div>

        <div class="btn-group">
          <button type="submit" class="user-long-btn" :disabled="authStore.loading">
            <template v-if="authStore.loading">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px">
                <span>Signing up...</span>
                <span class="loading-spinner"></span>
              </div>
            </template>
            <template v-else>
              Create account
            </template>
          </button>
          <button class="user-long-btn user-long-btn--google">
            <img src="@/assets/img/User/google-icon.svg" alt="Google Icon" />
            <span>Sign up with Google</span>
          </button>

          <div class="link-to-login">
            Already have account?
            <router-link to="/login" style="text-decoration: underline; color: #000">Log in</router-link>
          </div>
        </div>
      </form>

    </div>
  </div>

</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/User/auth.store';

const authStore = useAuthStore();
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
  button:first-of-type {
    margin-top: 40px;
  }

  .link-to-login {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
