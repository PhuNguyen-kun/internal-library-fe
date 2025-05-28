<template>
  <div class="form-login">
    <form @submit.prevent="authStore.login" class="form-login-container" id="form">
      <div>
        <div class="title">
          <h1 class="heading">Login to Account</h1>
          <p class="desc">Please enter your email and password to continue</p>
        </div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <div class="label">Email address</div>
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
        <div class="label">
          <div>Password</div>
        </div>
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

      <div class="error-message" v-if="authStore.formError" style="text-align: center; margin-top: 15px; margin-bottom: 0;">{{ authStore.formError }}</div>

      <div class="btn-group">
        <button type="submit" class="btn" :disabled="authStore.loading">
            Sign in
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/Admin/auth.store';

const authStore = useAuthStore();
</script>


<style scoped lang="scss">
.form-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #4880ff;
  background-image: url(/Shape.png);
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Nunito Sans', sans-serif;
}

.form-login-container {
  width: 400px;
  background-color: #fff;
  border-radius: 18px;
  padding: 0 40px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.heading {
  margin-top: 50px;
  font-size: 23px;
  font-weight: 700;
}

.desc {
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
}

.form-group {
  margin-top: 20px;
}

.label {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-input {
  width: 376px;
  height: 45px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
  padding: 0 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #f1f4f9;
}

.form-input.error {
  border: 1px solid red;
}

input:focus {
  border: 1px solid #4880ff;
  outline: none;
}

.form-input:last-of-type {
  margin-bottom: 8px;
}

.form-input::placeholder {
  color: #ccc;
}

.login-link {
  font-size: 14px;
  font-weight: 600;
  color: #969696;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 35px;
}

.btn {
  width: 300px;
  height: 40px;
  background-color: #4880ff;
  color: #fff;
  border-radius: 7px;
  border: none;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 30px;
}

.btn-group {
  margin-bottom: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.btn:hover {
  cursor: pointer;
}

.error-message {
  font-size: 14px;
  font-weight: 500;
  color: red;
  margin-bottom: 10px;
}

.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4880ff;
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

.error-message {
  margin-top: 0;
}
</style>
