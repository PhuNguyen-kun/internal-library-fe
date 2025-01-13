<template>
  <div>
    <h1 class="admin-page__title">Quản lý đơn mượn</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="orderStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm theo họ tên, mã nhân viên"
          @change="handleSearch"
        />
        <Button class="btn--primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
        </Button>
      </div>

      <div class="admin-page__heading--right">
        <Button
          v-if="selectedRows.length"
          class="btn btn--danger"
          @click="openDeleteSelectedConfirm"
        >
          <el-icon><Delete /></el-icon>
          <span>Xóa các mục đã chọn</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="orderStore.orders" :loading="fetchLoading" >
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" effect="dark" round>
          {{ row.status }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditModal(row)">
            <img alt="Edit" src="@/assets/img/Admin/edit.svg" />
          </el-button>
          <div class="divider"></div>
          <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)" disabled>
            <img alt="Delete" src="@/assets/img/Admin/delete.svg" />
          </el-button>
        </div>
      </template>
    </Table>

    <Pagination
      :pagination="orderStore.pagination"
      @changePage="(page: number) => orderStore.handlePageChange(page)"
    />
  </div>

  <Modal
    :formRef="orderStore.formRef"
    :title="orderStore.modalTitle"
    :visible="isModalVisible"
    style="width: 1000px"
    @close="orderStore.resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
    class="big-modal"
  >
    <el-form
      ref="orderFormRef"
      :model="order"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên người mượn" prop="full_name">
        <el-input v-model="order.full_name" placeholder="..." disabled />
      </el-form-item>

      <el-form-item label="Mã nhân viên" prop="employee_code">
        <el-input v-model="order.employee_code" placeholder="..." disabled />
      </el-form-item>

      <el-form-item label="Trạng thái" prop="status">
        <el-select v-model="order.status" placeholder="Chọn trạng thái">
          <el-option label="Đang mượn" value="Đang mượn" />
          <el-option label="Đã trả" value="Đã trả" />
          <el-option label="Quá hạn" value="Quá hạn" />
          <el-option label="Mất" value="Mất" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      :data="orderStore.selectedOrder?.details || []"
      border
      style="margin-top: 20px;"
      empty-text="Không có dữ liệu"
    >
      <el-table-column label="Thumbnail" width="100">
        <template #default="{ row }">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            alt="Thumbnail"
            style="width: 50px; height: 60px; object-fit: cover; margin-left: 10px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Tên sách" />
      <el-table-column prop="return_date_due" label="Ngày hẹn trả" />

      <el-table-column label="Ngày trả thực tế" width="250px">
        <template #default="{ row }">
          <el-date-picker
            v-model="row.return_date_real"
            type="date"
            placeholder="Chọn ngày trả thực tế"
            :disabled="row.status === 'Đã trả'"
            @change="handleReturnDateChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Trạng thái">
        <template #default="{ row }">
          <el-select v-if="row.status !== 'Đã trả'" v-model="row.status" placeholder="Chọn trạng thái">
            <el-option label="Đang mượn" value="Đang mượn" />
            <el-option label="Quá hạn" value="Quá hạn" />
            <el-option label="Mất" value="Mất" />
          </el-select>
          <span v-else>{{ row.status }}</span>
        </template>
      </el-table-column>
    </el-table>
  </Modal>

  <Modal
    :title="'Xác nhận xóa'"
    :visible="deleteConfirmVisible"
    style="width: 500px"
    @submit="handleDelete"
    @update:visible="deleteConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn xóa đơn mượn này?</span>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import Modal from "@/components/Admin/Common/Modal.vue";

import { useOrderStore } from "@/stores/Admin/order.store";
import { notifyError, notifySuccess } from "@/composables/notifications";
import type { Order } from "@/types/Admin/order";
import { Search, Delete } from "@element-plus/icons-vue";

const orderStore = useOrderStore();
const fetchLoading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);

const columns = [
  { prop: "full_name", label: "Tên người mượn", width: 200 },
  { prop: "employee_code", label: "Mã nhân viên", width: 400, align: "center" },
  { prop: "created_at", label: "Ngày mượn", width: 300 },
  { prop: "status", label: "Trạng thái", width: 250 },
  { prop: "actions", label: "Hành động", width: 125, align: "center" },
];

const formRules = {
  full_name: [{ required: true, message: "Tên người mượn không được trống", trigger: "blur" }],
  employee_code: [{ required: true, message: "Mã NV không được trống", trigger: "blur" }],
};

const order = reactive({
  id: 0,
  full_name: "",
  employee_code: "",
  status: "",
});

// Tag colors
const getStatusTagType = (status: string): string => {
  const statusTagTypes: Record<string, string> = {
    "Đang mượn": "primary",
    "Đã trả": "success",
    "Quá hạn": "warning",
    "Mất": "danger",
  };
  return statusTagTypes[status] ?? "info";
};

const handleReturnDateChange = (row: any) => {
  if (row.status === "Mất") return;

  const dueDate = new Date(row.return_date_due);
  const realDate = new Date(row.return_date_real);

  if (realDate > dueDate) {
    row.status = "Quá hạn";
  } else {
    row.status = "Đã trả";
  }
};

const openEditModal = async (row: Order) => {
  try {
    fetchLoading.value = true;
    await orderStore.fetchOrderWithDetails(row.id);

    if (orderStore.selectedOrder) {
      Object.assign(order, {
        id: orderStore.selectedOrder.id,
        full_name: orderStore.selectedOrder.full_name,
        employee_code: orderStore.selectedOrder.employee_code,
        status: orderStore.selectedOrder.status,
      });
    }

    orderStore.modalTitle = "Chi tiết đơn mượn";
    isModalVisible.value = true;
  } catch (error) {
    console.error("openEditModal error:", error);
  } finally {
    fetchLoading.value = false;
  }
};

const deleteConfirmVisible = ref<boolean>(false);
const deleteOrderId = ref<number>();

const openDeleteConfirm = (id: number) => {
  deleteOrderId.value = id;
  deleteConfirmVisible.value = true;
};

const handleDelete = () => {
  if (deleteOrderId.value) {
    orderStore.deleteOrder(deleteOrderId.value);
    deleteConfirmVisible.value = false;
  }
};

const selectedRows = ref([]);
const deleteSelectedConfirmVisible = ref(false);

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true;
};

const confirmDeleteSelectedOrders = async () => {
  const selectedIds = selectedRows.value.map((o: any) => o.id);
  await orderStore.deleteSelectedOrders(selectedIds);
  deleteSelectedConfirmVisible.value = false;
};

const handleSearch = async () => {
  orderStore.pagination.current_page = 1;
  await orderStore.fetchOrders();
};

// Submit
const handleSubmit = async () => {
  try {
    if (orderStore.selectedOrder) {
      const payload = {
        id: order.id,
        full_name: order.full_name,
        employee_code: order.employee_code,
        status: order.status,
        details: orderStore.selectedOrder.details.map((detail) => ({
          id: detail.id,
          status: detail.status,
          return_date_real: detail.return_date_real,
        })),
      };
      console.log("Submitting payload:", payload);

      await orderStore.updateOrder(order.id, payload);

      await orderStore.fetchOrders();
    }
    orderStore.resetForm();
    isModalVisible.value = false;
  } catch (error) {
    console.error("handleSubmit error:", error);
    notifyError("Cập nhật đơn mượn thất bại.");
  }
};

onMounted(() => {
  orderStore.fetchOrders();
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!orderStore.selectedOrder) {
      Object.assign(order, {
        id: "",
        full_name: "",
        employee_code: "",
        status: "",
      });
    }
  } else {
    orderStore.resetForm();
  }
});

watch(
  () => orderStore.selectedOrder,
  (newVal) => {
    console.log("Selected Order Details:", newVal);
  }
);
</script>
