import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import * as bookService from "@/services/User/bookService";
import * as homepageService from "@/services/User/homepageService";
import {defaultPagination} from "@/constants/Admin/pagination";
import {notifyError, notifyInfo, notifySuccess} from "@/composables/notifications";
import {useAuthStore} from "@/stores/User/auth.store";

export const useBookStore = defineStore("book", () => {
  const books = ref([]);
  const book = ref();
  const topBorrowedBooks = ref([]);
  const relatedBooks = ref([]);
  const reviews = ref([]);
  const categories = ref([]);
  const authors = ref([]);
  const publishers = ref([]);
  const searchTerm = ref<string>('');
  const borrowedBooks = ref([]);
  const statusFilter = ref<number[]>([]);
  const authStore = useAuthStore();

  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  });

  const reviewPagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 3,
  });

  const historyPagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 5,
  });

  const checkAuth = () => {
    if (!authStore.isLoggedIn) {
      notifyInfo("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }
    return true;
  };

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchBooks();
  }

  const handleHistoryPageChange = (page: number) => {
    historyPagination.current_page = page;
    fetchBorrowedBooks();
  }

  const handleReviewPageChange = (page: number) => {
    reviewPagination.current_page = page;
    fetchReviews(book.value.slug);
  }

  const fetchBooks = async (filters = {}) => {
    try {
      const response = await bookService.getBooks({
        search_term: searchTerm.value.trim(),
        per_page: pagination.per_page,
        page: pagination.current_page,
        ...filters
      });
      books.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      console.log(books.value);
    } catch (error) {
      console.error("Failed to fetch books", error);
      throw error;
    }
  };

  const fetchBook = async (id: number) => {
    try {
      const response = await bookService.getBook(id);
      book.value = response.data;
      console.log(book.value);
    } catch (error) {
      console.error("Failed to fetch book", error);
      throw error;
    }
  };

  const fetchBookBySlug = async (slug: string) => {
    try {
      const response = await bookService.getBookBySlug(slug);
      book.value = response.data;
      console.log("Fetched book by slug:", book.value);
    } catch (error) {
      console.error("Failed to fetch book by slug", error);
      throw error;
    }
  };

  const fetchTopBorrowedBooks = async () => {
    try {
      const response = await bookService.getTopBorrowedBooks();
      topBorrowedBooks.value = response.data.slice(0, 4);
      console.log(topBorrowedBooks.value);
    } catch (error) {
      console.error('Failed to fetch top borrowed books', error);
      throw error;
    }
  }

  const fetchReviews = async (slug: string, filter = {}) => {
    try {
      const response = await bookService.getReviews(slug, {
        per_page: reviewPagination.per_page,
        page: reviewPagination.current_page,
        ...filter
      });
      reviews.value = response.data.filter((review: any) => review.status === "Approved");
      reviewPagination.total = response.pagination.total;
      reviewPagination.total_pages = response.pagination.total_pages;

      console.log(reviews.value);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      throw error;
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await homepageService.getCategories();
      categories.value = response.data;
      console.log(categories.value);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      throw error;
    }
  };

  const fetchRelatedBooks = async (slug: string) => {
    try {
      const response = await bookService.getRelatedBooks(slug);
      relatedBooks.value = response.data;
      console.log("Related books:", relatedBooks.value);
    } catch (error) {
      console.error("Failed to fetch related books", error);
      throw error;
    }
  }

  const fetchAuthors = async () => {
    try {
      const response = await bookService.getAuthors();
      authors.value = response.data;
      console.log(authors.value);
    } catch (error) {
      console.error("Failed to fetch authors", error);
      throw error;
    }
  }

  const fetchPublishers = async () => {
    try {
      const response = await bookService.getPublishers();
      publishers.value = response.data;
      console.log(publishers.value);
    } catch (error) {
      console.error("Failed to fetch publishers", error);
      throw error;
    }
  }

  const fetchBorrowedBooks = async (filters = {}) => {
    try {
      const response = await bookService.getBorrowedBooks({
        per_page: historyPagination.per_page,
        page: historyPagination.current_page,
        ...filters
      });
      borrowedBooks.value = response.data;
      historyPagination.total = response.pagination.total;
      historyPagination.total_pages = response.pagination.total_pages;
      console.log(borrowedBooks.value);
    } catch (error) {
      console.error("Failed to fetch borrowed books", error);
      throw error;
    }
  };

  const submitReview = async (bookId: number, star: number, comment: string) => {
    if (!checkAuth()) return false;

    try {
      const response = await bookService.submitReview(bookId, star, comment);
      notifySuccess("Cảm ơn bạn! Đánh giá sẽ hiển thị sau khi được Admin duyệt.");
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      notifyError("Lỗi khi gửi đánh giá. Vui lòng thử lại!");
    }
  };

  return {
    books,
    book,
    reviews,
    categories,
    authors,
    publishers,
    topBorrowedBooks,
    relatedBooks,
    pagination,
    searchTerm,
    borrowedBooks,
    reviewPagination,
    historyPagination,
    statusFilter,
    fetchBooks,
    fetchBook,
    fetchTopBorrowedBooks,
    fetchBookBySlug,
    fetchReviews,
    fetchCategories,
    fetchRelatedBooks,
    fetchAuthors,
    fetchPublishers,
    handlePageChange,
    fetchBorrowedBooks,
    submitReview,
    handleReviewPageChange,
    handleHistoryPageChange,
  };
});
