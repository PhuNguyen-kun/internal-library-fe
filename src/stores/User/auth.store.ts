import { defineStore } from 'pinia';
import { login as loginService } from '@/services/Common/auth';
import {computed, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { logout as logoutService } from '@/services/Common/auth'
import { signup as signupService } from '@/services/Common/auth'
import {notifyError, notifySuccess} from "@/composables/notifications";
import {useUserStore} from "@/stores/User/user.store";

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const userStore = useUserStore();

  const name = ref<string>('');
  const email = ref<string>('');
  const password = ref<string>('');
  const errors = ref<{ email?: string; password?: string; name?: string }>({});
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const isLoggedIn = ref(!!localStorage.getItem("user_access_token"));

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^(kiaisoft\..+|.+@kiaisoft\.com)$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    errors.value = {};
    formError.value = '';

    if (!isValidEmail(email.value)) {
      errors.value.email = 'Nhập có hậu tố "@kiaisoft.com" hoặc tiền tố "kiaisoft';
      isValid = false;
    }

    if (password.value.length < 8) {
      errors.value.password = 'Mật khẩu ít nhất 8 ký tự';
      isValid = false;
    }

    if (!name.value.trim()) {
      errors.value.name = 'Vui lòng nhập tên';
      isValid = false;
    }

    return isValid;
  };

  const validateFormLogin = (): boolean => {
    let isValid = true;
    errors.value = {};
    formError.value = '';

    if (!isValidEmail(email.value)) {
      errors.value.email = 'Nhập có hậu tố "@kiaisoft.com" hoặc tiền tố "kiaisoft';
      isValid = false;
    }

    if (password.value.length < 8) {
      errors.value.password = 'Mật khẩu ít nhất 8 ký tự';
      isValid = false;
    }

    return isValid;
  };

  const login = async () => {
    const isValid = validateFormLogin();
    if (!isValid) return;

    loading.value = true;

    try {
      const response = await loginService({ email: email.value, password: password.value });
      await userStore.fetchUserInfo();
      console.log("User info:", userStore.userInfo);

      console.log("API response:", response.data);

      const access_token = response.data.access_token;
      if (!access_token) {
        throw new Error("Token is missing from response.");
      }

      localStorage.setItem("user_access_token", access_token);
      console.log("User token saved");
      isLoggedIn.value = true;
      await router.push('/');
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.error === 'Tài khoản đã bị chặn') {
          notifyError('Tài khoản này đã bị chặn!');
        } else {
          formError.value = 'Email hoặc mật khẩu không đúng!';
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
      isLoggedIn.value = false;
      const currentPath = router.currentRoute.value.path;

      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('admin_access_token');

        await router.push('/admin/login');
      } else {
        localStorage.removeItem('user_access_token');
        console.log(1)
        localStorage.removeItem('userInfo');
        console.log(2)
        await router.push('/');
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

      await userStore.fetchUserInfo();

      console.log("Signup response:", response.data);

      const access_token = response.data.access_token;
      if (!access_token) {
        throw new Error("Token is missing from response.");
      }

      localStorage.setItem("user_access_token", access_token);
      console.log("User token saved");
      notifySuccess("Đăng ký thành công!");

      await router.push('/login');
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.errors?.email && error.response.data.errors.email[0] === "The email has already been taken.") {
          formError.value = "Người dùng đã tồn tại.";
        } else {
          formError.value = error.response.data.error || error.response.data.message;
        }
        notifyError(formError.value);
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
