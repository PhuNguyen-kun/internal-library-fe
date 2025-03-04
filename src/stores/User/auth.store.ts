import { defineStore } from 'pinia';
import { login as loginService } from '@/services/Common/auth';
import {computed, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { logout as logoutService } from '@/services/Common/auth'
import { signup as signupService } from '@/services/Common/auth'
import {notifyError, notifySuccess} from "@/composables/notifications";
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const name = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');
  const errors = ref<{ email?: string; password?: string }>({});
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const isLoggedIn = ref(!!localStorage.getItem("user_access_token"));

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

    if (password.value.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    return isValid;
  };

  const login = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    loading.value = true;

    try {
      const response = await loginService({ email: email.value, password: password.value });

      console.log("API response:", response.data);

      const access_token = response.data.access_token;
      if (!access_token) {
        throw new Error("Token is missing from response.");
      }

      localStorage.setItem("user_access_token", access_token);
      console.log("User token saved");
      isLoggedIn.value = true;
      router.push('/homepage');
    } catch (error: any) {
      if (error.response) {
        formError.value = 'Email or Password is incorrect!';
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
      isLoggedIn.value = false;
      const currentPath = router.currentRoute.value.path;

      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('admin_access_token');
        await router.push('/admin/login');
      } else {
        localStorage.removeItem('user_access_token');
        await router.push('/homepage');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const signup = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    loading.value = true;

    try {
      const response = await signupService({
        full_name: name.value,
        email: email.value,
        password: password.value,
      });

      console.log("Signup response:", response.data); // Debug API response

      const access_token = response.data.access_token;
      if (!access_token) {
        throw new Error("Token is missing from response.");
      }

      localStorage.setItem("user_access_token", access_token);
      console.log("User token saved");
      notifySuccess("Đăng ký thành công!");

      router.push('/homepage');
    } catch (error: any) {
      if (error.response) {
        formError.value = error.response.data.message || 'An error occurred during signup';
        notifyError('Đăng ký thất bại!');
      } else {
        console.error("Signup error:", error);
        notifyError('Đăng ký thất bại!');
      }
    } finally {
      loading.value = false;
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
    signup,
    validateForm,
    isValidEmail,
    isLoggedIn,
  };
});
