import {defineStore} from "pinia";
import type {Book, Option} from "@/types/Admin/book";
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";
import * as bookService from "@/services/Admin/bookService";
import {fetchAuthors, fetchCategories, fetchPublishers} from "@/services/Admin/bookService";
export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([]);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 5,
  });

  const searchTerm = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedBook = ref<Book | null>(null);

  const columns = [
    {prop: "title", label: "Tên sách", width: 200, type: "string", fixed: "left", lineClamp: 2},
    {prop: "image_url", label: "Ảnh", width: 180, align: "center"},
    {prop: "author", label: "Tác giả", width: 300, type: "string"},
    {prop: "publisher", label: "Nhà xuất bản", width: 210},
    {prop: "category", label: "Danh mục", width: 200},
    {prop: "published_year", label: "Năm xuất bản", width: 150, align: "center"},
    {prop: "stock_quantity", label: "Số lượng", width: 100, align: "center"},
    {prop: "page", label: "Số trang", width: 170, align: "center"},
    {prop: "short_description", label: "Mô tả ngắn", width: 300, lineClamp: 2},
    {prop: "description", label: "Mô tả đầy đủ", width: 400, lineClamp: 2},
    {prop: "actions", label: "Hành động", width: 125, align: "center", fixed: "right"}
  ];

  const includeDeleted = ref<boolean>(false);

  const fetchBooks = async () => {
    try {
      loading.value = true;

      const response = await bookService.fetchBooks(
        searchTerm.value.trim(),
        pagination.per_page,
        pagination.current_page,
        includeDeleted.value,
        filters
      );

      books.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value = false;
    } catch (error) {
      handleError(error, 'Failed to fetch books');
    }
  };

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchBooks();
  }

  const createBook = async (book: Book) => {
    try {
      loading.value=true;
      await bookService.createBook(book);
      notifySuccess("Sách đã được tạo thành công");
      await fetchBooks();
    }
    catch (error) {
      handleError(error, 'Failed to create author');
    }
    finally {
      loading.value=false;
    }
  }

  const updateBook = async (id: number, book: FormData) => {
    try {
      loading.value=true;
      await bookService.updateBook(id, book);
      notifySuccess("Sách đã được cập nhật thành công");
      await fetchBooks();
    } catch (error) {
      handleError(error, 'Failed to update book');
    }
  }

  const deleteBook = async (id: number) => {
    try {
      await bookService.deleteBook(id);
      notifySuccess("Sách đã được xóa thành công");
      await fetchBooks();
    } catch (error) {
      console.log(error);
      notifyError("Không thể xóa vì sách đang tồn tại trong đơn mượn!");
    }
  }

  const deleteSelectedBooks = async (ids: number[]) => {
    try {
      loading.value = true;
      for (const id of ids) {
        await bookService.deleteBook(id);
      }
      notifySuccess("Đã xóa sách được chọn");
      await fetchBooks();
    } catch (error) {
      console.log(error);
      notifyError("Không thể xóa vì sách đang tồn tại trong đơn mượn!");
    } finally {
      loading.value = false;
    }
  }

  const restoreSelectedBooks = async (ids: number[]) => {
    try {
      loading.value = true;
      for (const id of ids) {
        await bookService.restoreBook(id);
      }
      notifySuccess("Đã khôi phục sách được chọn");
      await fetchBooks();
    } catch (error) {
      handleError(error, 'Failed to restore selected books');
    } finally {
      loading.value = false;
    }
  }

  const authors = ref<Option[]>([]);
  const categories = ref<Option[]>([]);
  const publishers = ref<Option[]>([]);

  const fetchAllData = async (fetchFunction: (page: number) => Promise<any>) => {
    const allData: any[] = [];
    let currentPage = 1;

    while (true) {
      const response = await fetchFunction(currentPage);
      allData.push(...response.data);

      if (response.pagination.current_page >= response.pagination.total_pages) {
        break;
      }

      currentPage++;
    }

    return allData;
  };

  const fetchAuthorsCategoriesPublishers = async () => {
    try {
      const [allAuthors, allCategories, allPublishers] = await Promise.all([
        fetchAllData((page: number) => fetchAuthors(page)),
        fetchAllData((page: number) => fetchCategories(page)),
        fetchAllData((page: number) => fetchPublishers(page)),
      ]);

      authors.value = allAuthors.map((author: any) => ({
        value: author.id,
        label: author.name,
      }));

      categories.value = allCategories.map((category: any) => ({
        value: category.id,
        label: category.name,
      }));

      publishers.value = allPublishers.map((publisher: any) => ({
        value: publisher.id,
        label: publisher.name,
      }));

      console.log(authors.value);
      console.log(categories.value);
      console.log(publishers.value);
    } catch (error) {
      console.error('Failed to fetch authors, categories, or publishers:', error);
    }
  };

  const restoreBook = async (id: number) => {
    try {
      loading.value = true;
      await bookService.restoreBook(id);
      notifySuccess("Sách đã được khôi phục thành công.");
      await fetchBooks();
    } catch (error) {
      handleError(error, "Không thể khôi phục sách");
    } finally {
      loading.value = false;
    }
  };

  const filters = reactive({
    author: null,
    publisher: null,
    category: null,
  });

  const setFilters = (newFilters: any) => {
    filters.author = newFilters.author;
    filters.publisher = newFilters.publisher;
    filters.category = newFilters.category;
  };

  return {
    books,
    authors,
    includeDeleted,
    publishers,
    categories,
    pagination,
    searchTerm,
    loading,
    columns,
    selectedBook,
    fetchBooks,
    handlePageChange,
    createBook,
    updateBook,
    deleteBook,
    deleteSelectedBooks,
    fetchAuthorsCategoriesPublishers,
    restoreBook,
    restoreSelectedBooks,
    setFilters
  }
});
