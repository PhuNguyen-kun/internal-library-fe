import axiosInstance from "@/utils/axiosInstance";

export const getBooks = async (params = {}) => {
  console.log("Sending request with params:", params);

  try {
    const response = await axiosInstance.get("/user/books", { params });

    console.log("✅ Received response:", response.data);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Failed to fetch books", error);
    throw error;
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/user/books/${slug}`);
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch book by slug", error);
    throw error;
  }
}

export const getBook = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/user/books/${id}`);
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch book", error);
    throw error;
  }
}

export const getTopBorrowedBooks = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/top-borrowed-books");
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error('Failed to fetch top borrowed books', error);
    throw error;
  }
}

export const getReviews = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/user/books/${slug}/reviews`);
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    throw error;
  }
}

export const getRelatedBooks = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/user/books/${slug}/related-books`);
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch related books", error);
    throw error;
  }
}

export const getAuthors = async ()=> {
  try {
    const response = await axiosInstance.get(`/admin/authors`, {
      params: { per_page: 100 },
    });
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch authors", error);
    throw error;
  }
}

export const getPublishers = async ()=> {
  try {
    const response = await axiosInstance.get(`/admin/publishers`, {
      params: { per_page: 100 },
    });
    return {
      data: response.data.data
    };
  } catch (error) {
    console.error("Failed to fetch publishers", error);
    throw error;
  }
}


