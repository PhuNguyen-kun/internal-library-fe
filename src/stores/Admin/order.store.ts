import {defineStore} from "pinia";
import type {Order} from "@/types/Admin/order";
import {ref, reactive} from 'vue';
import {defaultPagination} from '@/constants/Admin/pagination';
import {notifyError, notifySuccess} from "@/composables/notifications";
import {handleError} from "@/utils/Admin/handleError";
import * as orderService from "@/services/Admin/orderService";
export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: defaultPagination.per_page
  });

  const searchTerm = ref<string>('');
  const loading = ref<boolean>(false);
  const selectedOrder = ref<Order | null>(null);

  const formRef = ref();
  const modalTitle = ref<string>("");
  const resetForm = () => {
    formRef.value?.resetFields();
    selectedOrder.value = null;
  }
  const fetchOrders = async () => {
    try {
      loading.value = true;
      const response = await orderService.fetchOrders(searchTerm.value.trim(), pagination.per_page, pagination.current_page);
      orders.value = response.data;
      pagination.total = response.pagination.total;
      pagination.total_pages = response.pagination.total_pages;
      loading.value=false;
    } catch (error) {
      notifyError('Failed to fetch authors', error as string);
    }
  }

  const handlePageChange = (page: number) => {
    pagination.current_page = page;
    fetchOrders();
  }

  const createOrder = async (order: Order) => {
    try {
      loading.value=true;
      await orderService.createOrder(order);
      notifySuccess("Đơn mượn đã được tạo thành công");
      await fetchOrders();
    }
    catch (error) {
      handleError(error, 'Failed to create author');
    }
    finally {
      loading.value=false;
    }
  }

  const updateOrder = async (id: number, order: Order) => {
    try {
      loading.value=true;
      await orderService.updateOrder(id, order);
      notifySuccess("Đơn mượn đã được cập nhật thành công");
      await fetchOrders();
    } catch (error) {
      handleError(error, 'Failed to update order');
    } finally {
      loading.value=false;
    }
  }

  const deleteOrder = async (id: number) => {
    try {
      await orderService.deleteOrder(id);
      notifySuccess("Đơn mượn đã được xóa thành công");
      await fetchOrders();
    } catch (error) {
      handleError(error, 'Failed to delete order');
    }
  }

  const deleteSelectedOrders = async (ids: number[]) => {
    try {
      loading.value = true;
      for (const id of ids) {
        await orderService.deleteOrder(id);
      }
      notifySuccess("Đã xóa nhà xuất bản được chọn");
      await fetchOrders();
    } catch (error) {
      handleError(error, 'Failed to delete selected orders');
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    formRef,
    modalTitle,
    resetForm,
    pagination,
    searchTerm,
    loading,
    selectedOrder,
    fetchOrders,
    handlePageChange,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteSelectedOrders
  }
});
