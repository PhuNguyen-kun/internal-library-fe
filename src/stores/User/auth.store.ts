import { defineStore } from 'pinia';
import { login as loginService } from '@/services/Common/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout as logoutService } from '@/services/Common/auth'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const name = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');
  const errors = ref<{ email?: string; password?: string }>({});
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const isLoggedIn = ref<boolean>(!!localStorage.getItem('access_token'));

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    errors.value = {};
    formError.value = '';

    if (!isValidEmail(email.value)) {
      errors.value.email = 'Please enter a valid email';
      isValid = false;
    }

    if (password.value.length < 6) {
      errors.value.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  };

  const login = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    loading.value = true;

    try {
      const response = await loginService({ email: email.value, password: password.value });

      const access_token = response.data.access_token;
      localStorage.setItem('access_token', access_token);
      isLoggedIn.value = true;

      formError.value = '';
      router.push('/homepage');
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          formError.value = 'Email or Password is incorrect!';
        } else if (error.response.status === 401) {
          formError.value = 'Email or Password is incorrect!';
        } else {
          formError.value = 'Email or Password is incorrect!';
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      localStorage.removeItem('access_token');
      isLoggedIn.value = false;
      router.push('/homepage');
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    name,
    email,
    password,
    errors,
    formError,
    loading,
    login,
    logout,
    validateForm,
    isValidEmail,
    isLoggedIn,
  };
});
