import { defineStore } from 'pinia';
import type {Review} from '@/types/Admin/review';
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import * as reviewService from '@/services/Admin/reviewService';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<Review[]>([]);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 9,
  });
  const searchTerm = ref<string>('');
  const formError = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedReview = ref<Review | null>(null);
  const selectedStars = ref<number[]>([]);
  const selectedStatus = ref<number[]>([]);

  const fetchReviews = async () => {
    try {
      loading.value = true;
      const response = await reviewService.getReviews({
        search_term: searchTerm.value.trim(),
        stars: selectedStars.value,
        status: selectedStatus.value,
        page: pagination.current_page,
        per_page: pagination.per_page
      });

      reviews.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value = false;
    } catch (error) {
      handleError(error, 'Failed to fetch reviews');
    }
  };

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchReviews();
  }

  const createReview = async (review: Review) => {
    try {
      loading.value=true;
      await reviewService.createReview(review);
      notifySuccess("Tác giả đã được tạo thành công");
      await fetchReviews();
    }
    catch (error) {
      handleError(error, 'Failed to create review');
    }
    finally {
      loading.value=false;
    }
  }

  const updateReview = async (id: number, payload: { id: number; status: string }) => {
    try {
      loading.value = true;
      await reviewService.updateReview(id, payload);
      notifySuccess("Đánh giá đã được cập nhật.");
      await fetchReviews();
    } catch (error) {
      handleError(error, "Failed to update review");
    } finally {
      loading.value = false;
    }
  };

  const statusMapping = {
    Pending: 0,
    Approved: 1,
    Rejected: 2,
  } as any;

  const updateMultipleReviews = async (ids: number[], status: string) => {
    try {
      loading.value = true;

      const mappedStatus = statusMapping[status];
      if (mappedStatus === undefined) {
        throw new Error('Invalid status provided');
      }

      for (const id of ids) {
        await reviewService.updateReview(id, { id, status: mappedStatus });
      }

      notifySuccess('Đánh giá đã được cập nhật.');
      await fetchReviews();
    } catch (error) {
      handleError(error, 'Failed to update reviews');
    } finally {
      loading.value = false;
    }
  };

  return {
    reviews,
    pagination,
    formError,
    loading,
    selectedReview,
    searchTerm,
    selectedStars,
    selectedStatus,
    createReview,
    updateReview,
    fetchReviews,
    handlePageChange,
    updateMultipleReviews
  };
});
