import axiosInstance from "@/utils/axiosInstance";
import type {Book} from "@/types/Admin/book";

export const fetchBooks = async (
  searchTerm: string = '',
  perPage: number,
  page: number,
  includeDeleted: boolean = false,
  filters: any = {}
) => {
  try {
    const response = await axiosInstance.get('/admin/books', {
      params: {
        search_term: searchTerm,
        per_page: perPage,
        page,
        include_deleted: includeDeleted ? 1 : 0,
        author_slug: filters.author,
        publisher_slug: filters.publisher,
        category_slug: filters.category,
      }
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Failed to fetch books', error);
    throw error;
  }
};

export const createBook = async (book: Book) => {
  try {
    const response = await axiosInstance.post("/admin/books", book, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create book', error);
    throw error;
  }
}

export const updateBook = async (id: number, book: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/books/${id}?_method=PUT`, book, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update book', error);
    throw error;
  }
};

export const deleteBook = async (id: number) => {
  try {
    await axiosInstance.delete(`/admin/books/${id}`);
  } catch (error) {
    console.error(`Failed to delete book with id ${id}`, error);
    throw error;
  }
}

export const fetchAuthors = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/admin/authors', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch authors', error);
    throw error;
  }
};

export const fetchCategories = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/admin/categories', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories', error);
    throw error;
  }
};

export const fetchPublishers = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/admin/publishers', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch publishers', error);
    throw error;
  }
};

export const restoreBook = async (id: number) => {
  try {
    await axiosInstance.patch(`/admin/books/${id}/restore`);
  } catch (error) {
    console.error(`Failed to restore book with id ${id}`, error);
    throw error;
  }
}

