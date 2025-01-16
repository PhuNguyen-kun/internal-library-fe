import { defineStore } from 'pinia';
import type { User } from '@/types/Admin/user';
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import * as userService from '@/services/Admin/userService';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
    const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 9
  });
  const searchTerm = ref<string>('');
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedUser = ref<User | null>(null);

  const fetchUsers = async () => {
    try {
      loading.value=true;
      const response = await userService.getUsers(searchTerm.value.trim(), pagination.per_page, pagination.current_page);
      users.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value=false;
    } catch (error) {
      handleError(error, 'Failed to fetch users');
    }
  }

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchUsers();
  }

  const createUser = async (user: User) => {
    try {
      loading.value=true;
      await userService.createUser(user);
      notifySuccess("Người dùng đã được tạo thành công");
      await fetchUsers();
    }
    catch (error) {
      handleError(error, 'Failed to create user');
    }
    finally {
      loading.value=false;
    }
  }

  const updateUser = async (id: number, user: User) => {
    try {
      loading.value=true;
      await userService.updateUser(id, user);
      notifySuccess("Người dùng đã được cập nhật thành công");
      await fetchUsers();
    }
    catch (error) {
      handleError(error, 'Failed to update user');
    }
    finally {
      loading.value=false;
    }
  }

  const blockUser = async (id: number) => {
    try {
      const user = users.value.find(user => user.id === id);
      if (user) {
        user.status = 'Inactive';
        await userService.updateUser(id, user);
        notifySuccess("Người dùng đã được chặn thành công");
        await fetchUsers();
      }
    } catch (error) {
      handleError(error, 'Failed to block user');
    }
  };

  const blockSelectedUsers = async (ids: number[]) => {
    try {
      for (const id of ids) {
        await blockUser(id);
      }
    } catch (error) {
      handleError(error, 'Failed to block selected users');
    }
  };

  return {
    users,
    pagination,
    formError,
    loading,
    selectedUser,
    searchTerm,
    createUser,
    updateUser,
    fetchUsers,
    handlePageChange,
    blockUser,
    blockSelectedUsers
  };
});
