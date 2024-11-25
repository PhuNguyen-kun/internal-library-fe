<template>
  <div class="form-login">
    <form @submit.prevent="handleSubmit" class="form-login-container" id="form">
      <div>
        <div class="title">
          <h1 class="heading">Login to Account</h1>
          <p class="desc">Please enter your email and password to continue</p>
        </div>
      </div>
      <div class="error-message" v-if="formError" style="text-align: center">{{ formError }}</div>

      <!-- Email -->
      <div class="form-group">
        <div class="label">Email address</div>
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="form-input"
          :class="{ error: errors.email || formError }"
          @input="validateEmail"
        />
        <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="label">
          <div>Password</div>
          <a href="#!" class="login-link">Forget Password?</a>
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="form-input"
          :class="{ error: errors.password || formError }"
          @input="validatePassword"
        />
        <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
      </div>

      <label class="form-checkbox">
        <input type="checkbox" v-model="remember" />
        <span class="form-checkbox-label login-link">Remember Password</span>
      </label>

      <div class="btn-group">
        <button type="submit" class="btn" @click="loginAccount">Sign in</button>
        <div class="link-to-signup">
          <p>Don't have an account?</p>
          <a href="#" style="text-decoration: underline; color: #5a8cff">Create Account</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/services/Common/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const remember = ref<boolean>(false)
const errors = ref<{ email?: string; password?: string }>({})
const formError = ref<string>('');

const handleSubmit = () => {
  const isValid = checkValidation()

  if (isValid) {
    console.log('Successfully')
  } else {
    console.log('Failed')
  }
}
const loginAccount = async () => {
  const isValid = checkValidation();
  if (!isValid) {
    return;
  }

  const loginForm = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await login(loginForm);

    const access_token = response.data.access_token;
    localStorage.setItem('access_token', access_token);

    router.push('/admin/dashboard');
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 401)) {
      formError.value = 'Email or Password is incorrect!';
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

const checkValidation = (): boolean => {
  let isValid = true
  errors.value = {}
  formError.value = '';

  if (!isValidEmail(email.value)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateEmail = () => {
  if (isValidEmail(email.value)) {
    removeError('email')
  }
}

const validatePassword = () => {
  if (password.value.length >= 8) {
    removeError('password')
  }
}

const removeError = (field: 'email' | 'password') => {
  if (errors.value[field]) {
    errors.value[field] = ''
  }
}
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

.link-to-signup {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-size: 14px;
  gap: 5px;
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
</style>
