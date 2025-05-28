import {defineStore} from "pinia";
import type {Publisher} from "@/types/Admin/publisher";
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";
import * as publisherService from "@/services/Admin/publisherService";
export const usePublisherStore = defineStore('publisher', () => {
  const publishers = ref<Publisher[]>([]);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 9
  });

  const searchTerm = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedPublisher = ref<Publisher | null>(null);

  const fetchPublishers = async () => {
    try {
      loading.value = true;
      const response = await publisherService.fetchPublishers(searchTerm.value.trim(), pagination.per_page, pagination.current_page);
      publishers.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value=false;
    } catch (error) {
      notifyError('Failed to fetch authors', error as string);
    }
  }

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchPublishers();
  }

  const createPublisher = async (publisher: Publisher) => {
    try {
      loading.value=true;
      await publisherService.createPublisher(publisher);
      notifySuccess("Tác giả đã được tạo thành công");
      await fetchPublishers();
    }
    catch (error) {
      handleError(error, 'Failed to create author');
    }
    finally {
      loading.value=false;
    }
  }

  const updatePublisher = async (id: number, publisher: Publisher) => {
    try {
      loading.value=true;
      await publisherService.updatePublisher(id, publisher);
      notifySuccess("Tác giả đã được cập nhật thành công");
      await fetchPublishers();
    } catch (error) {
      handleError(error, 'Failed to update publisher');
    } finally {
      loading.value=false;
    }
  }

  const deletePublisher = async (id: number) => {
    try {
      await publisherService.deletePublisher(id);
      notifySuccess("Nhà xuất bản đã được xóa thành công");
      await fetchPublishers();
    } catch (error) {
      console.log(error);
      notifyError('Không thể xóa vì tồn tại sách thuộc NXB này!');
    }
  }

  const deleteSelectedPublishers = async (ids: number[]) => {
    try {
      loading.value = true;
      for (const id of ids) {
        await publisherService.deletePublisher(id);
      }
      notifySuccess("Đã xóa nhà xuất bản được chọn");
      await fetchPublishers();
    } catch (error) {
      console.log(error);
      notifyError('Không thể xóa vì tồn tại sách thuộc NXB được chọn!');
    } finally {
      loading.value = false;
    }
  }

  return {
    publishers,
    pagination,
    searchTerm,
    loading,
    selectedPublisher,
    fetchPublishers,
    handlePageChange,
    createPublisher,
    updatePublisher,
    deletePublisher,
    deleteSelectedPublishers
  }
});
