import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import * as bookService from "@/services/User/bookService";
import type {Book} from "@/types/Admin/book";
import * as homepageService from "@/services/User/homepageService";
import {defaultPagination} from "@/constants/Admin/pagination";

export const useBookStore = defineStore("book", () => {
  const books = ref([]);
  const book = ref(null);
  const topBorrowedBooks = ref([]);
  const relatedBooks = ref([]);
  const reviews = ref([]);
  const categories = ref([]);
  const authors = ref([]);
  const publishers = ref([]);
  const searchTerm = ref<string>('');
  const borrowedBooks = ref([]);

  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  });

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchBooks();
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

  const fetchReviews = async (slug: string) => {
    try {
      const response = await bookService.getReviews(slug);
      reviews.value = response.data;
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
      console.log(relatedBooks.value);
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
      const response = await bookService.getBorrowedBooks(filters);
      borrowedBooks.value = response.data;
      console.log(borrowedBooks.value);
    } catch (error) {
      console.error("Failed to fetch borrowed books", error);
      throw error;
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
  };
});
