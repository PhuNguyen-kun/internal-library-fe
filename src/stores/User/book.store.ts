import {defineStore} from "pinia";
import {ref} from "vue";
import * as bookService from "@/services/User/bookService";
import type {Book} from "@/types/Admin/book";

export const useBookStore = defineStore("book", () => {
  const books = ref([]);
  const book = ref(null);
  const topBorrowedBooks = ref([]);
  const relatedBooks = ref([]);
  const reviews = ref([]);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getBooks();
      books.value = response.data;
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

  return {
    books,
    book,
    reviews,
    topBorrowedBooks,
    relatedBooks,
    fetchBooks,
    fetchBook,
    fetchTopBorrowedBooks,
    fetchBookBySlug,
    fetchReviews,
    fetchRelatedBooks
  };
});
