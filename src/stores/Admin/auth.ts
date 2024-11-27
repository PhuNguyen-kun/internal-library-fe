import { defineStore } from 'pinia';
import { login as loginService } from '@/services/Common/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElLoading } from 'element-plus'
import { logout as logoutService } from '@/services/Common/auth'

const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 500)
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const email = ref<string>('');
  const password = ref<string>('');
  const errors = ref<{ email?: string; password?: string }>({});
  const formError = ref<string>('');
  const loading = ref<boolean>(false);

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

    openFullScreen2()

    try {
      const response = await loginService({ email: email.value, password: password.value });

      const access_token = response.data.access_token;
      localStorage.setItem('access_token', access_token);

      formError.value = '';
      router.push('/admin/dashboard');
    } catch (error: any) {
      if (error.response && (error.response.status === 404 || error.response.status === 401)) {
        formError.value = 'Email or Password is incorrect!';
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  const logout = async () => {
    try {
      await logoutService()
      console.log('ok')
      localStorage.removeItem('access_token')
      await router.push('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return {
    email,
    password,
    errors,
    formError,
    loading,
    login,
    logout,
    validateForm,
    isValidEmail,
  };
});
