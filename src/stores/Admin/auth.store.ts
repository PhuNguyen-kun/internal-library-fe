import { defineStore } from 'pinia';
import { login as loginService } from '@/services/Common/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout as logoutService } from '@/services/Common/auth'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const email = ref<string>('');
  const password = ref<string>('');
  const errors = ref<{ email?: string; password?: string }>({});
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const user = ref<any>(null);

  const initUser = () => {
    const userData = localStorage.getItem('admin_user_data');
    if (userData) {
      user.value = JSON.parse(userData);
    }
  };

  initUser();

  const fetchUserProfile = async () => {
    // Simply load from localStorage instead of making an API call
    const userData = localStorage.getItem('admin_user_data');
    if (userData) {
      try {
        user.value = JSON.parse(userData);
        console.log('User profile loaded from localStorage:', user.value);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    } else {
      console.warn('No user data found in localStorage');
    }
  };
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^(kiaisoft\..+|.+@kiaisoft\.com)$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    errors.value = {};
    formError.value = '';

    if (!isValidEmail(email.value)) {
      errors.value.email = 'Email có hậu tố "@kiaisoft.com" hoặc tiền tố "kiaisoft"';
      isValid = false;
    }

    if (password.value.length < 8) {
      errors.value.password = 'Mật khẩu ít nhất 8 ký tự';
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

      console.log('API response:', response.data);

      const access_token = response.data.access_token;
      const user_role = response.data.profile.role;
      user.value = response.data.profile;

      console.log('User role:', user_role);

      if (user_role === 0) { // Admin
        localStorage.setItem('admin_access_token', access_token);
        localStorage.setItem('admin_user_data', JSON.stringify(user.value));
        console.log('Admin token saved');
      } else { // User
        localStorage.setItem('user_access_token', access_token);
        console.log('User token saved');
      }

      formError.value = '';
      if (user_role === 0) {
        console.log('Navigating to /admin/dashboard');
        router.push('/admin/dashboard');
      } else {
        formError.value = 'Email hoặc mật khẩu không đúng!';
      }
    } catch (error: any) {
      if (error.response) {
        formError.value = 'Email hoặc mật khẩu không đúng!';
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      loading.value = false;
    }
  };

  // const logout = async () => {
  //   try {
  //     await logoutService()
  //     localStorage.removeItem('access_token')
  //     await router.push('/admin/login')
  //   } catch (error) {
  //     console.error('Failed to logout:', error)
  //   }
  // }

  const logout = async () => {
    try {
      await logoutService();

      const currentPath = router.currentRoute.value.path;

      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_user_data');
        await router.push('/admin/login');
      } else {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('admin_user_data');
        await router.push('/user/login');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return {
    email,
    password,
    errors,
    formError,
    loading,
    user,
    login,
    logout,
    validateForm,
    isValidEmail,
    fetchUserProfile,
  };
});
