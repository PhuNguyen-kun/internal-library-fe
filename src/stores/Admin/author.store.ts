import { defineStore } from 'pinia';
import type { Author } from '@/types/Admin/author';
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import * as authorService from '@/services/Admin/authorService';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";

export const useAuthorStore = defineStore('author', () => {
  const authors = ref<Author[]>([]);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: defaultPagination.per_page
  });
  const searchTerm = ref<string>('');
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedAuthor = ref<Author | null>(null);

  const fetchAuthors = async () => {
    try {
      loading.value=true;
      const response = await authorService.getAuthors(searchTerm.value.trim(), pagination.per_page, pagination.current_page);
      authors.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value=false;
    } catch (error) {
      notifyError('Failed to fetch authors', error as string);
    }
  }

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchAuthors();
  }

  const createAuthor = async (author: Author) => {
    try {
      loading.value=true;
      await authorService.createAuthor(author);
      notifySuccess("Tác giả đã được tạo thành công");
      await fetchAuthors();
    }
    catch (error) {
      handleError(error, 'Failed to create author');
    }
    finally {
      loading.value=false;
    }
  }

  const updateAuthor = async (id: number, author: Author) => {
    try {
      loading.value=true;
      await authorService.updateAuthor(id, author);
      notifySuccess("Tác giả đã được cập nhật thành công");
      await fetchAuthors();
    }
    catch (error) {
      handleError(error, 'Failed to update author');
    }
    finally {
      loading.value=false;
    }
  }

  const deleteAuthor = async (id: number) => {
    try {
      loading.value = true;
      await authorService.deleteAuthor(id);
      notifySuccess("Tác giả đã được xóa thành công");
      await fetchAuthors();
    } catch (error) {
      handleError(error, "Failed to delete author");
    } finally {
      loading.value = false;
    }
  };

    const deleteSelectedAuthors = async (ids: number[]) => {
      try {
        loading.value = true;
        for (const id of ids) {
          await authorService.deleteAuthor(id);
        }
        notifySuccess("Đã xóa các tác giả được chọn");
        await fetchAuthors();
      } catch (error) {
        handleError(error, "Failed to delete selected authors");
      } finally {
        loading.value = false;
      }
    };

  return {
    authors,
    pagination,
    formError,
    loading,
    selectedAuthor,
    searchTerm,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    deleteSelectedAuthors,
    fetchAuthors,
    handlePageChange
  };
});
