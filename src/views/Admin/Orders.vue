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
        <el-select
          v-model="orderStore.selectedStatus"
          class="filter-select"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          placeholder="Lọc theo trạng thái"
        >
          <el-option :value="0" label="Đang mượn"/>
          <el-option :value="1" label="Đã trả"/>
          <el-option :value="2" label="Quá hạn"/>
          <el-option :value="3" label="Mất"/>
        </el-select>

        <div>
          <el-date-picker
            v-model="selectedDateRange"
            end-placeholder="Ngày kết thúc"
            range-separator="Đến"
            start-placeholder="Ngày bắt đầu"
            type="daterange"
            unlink-panels
          />
        </div>

        <Button class="btn--primary" @click="handleSearch">
          <el-icon>
            <Search/>
          </el-icon>
        </Button>
      </div>

      <div class="admin-page__heading--right">
        <Button
          v-if="selectedRows.length"
          class="btn btn--danger"
          @click="openDeleteSelectedConfirm"
        >
          <el-icon>
            <Delete/>
          </el-icon>
          <span>Xóa các mục đã chọn</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="orderStore.orders" :loading="fetchLoading">
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)" effect="dark" round>
          {{ row.status }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditModal(row)">
            <img alt="Edit" src="@/assets/img/Admin/edit.svg"/>
          </el-button>
          <div class="divider"></div>
          <el-button disabled link size="small" type="danger" @click="openDeleteConfirm(row.id)">
            <img alt="Delete" src="@/assets/img/Admin/delete.svg"/>
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
    class="big-modal"
    style="width: 1000px"
    @close="orderStore.resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
  >
    <el-form
      ref="orderFormRef"
      :model="order"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên người mượn" prop="full_name">
        <el-input v-model="order.full_name" disabled placeholder="..."/>
      </el-form-item>

      <el-form-item label="Mã nhân viên" prop="employee_code">
        <el-input v-model="order.employee_code" disabled placeholder="..."/>
      </el-form-item>

      <!--      <el-form-item label="Trạng thái" prop="status">-->
      <!--        <el-select v-model="order.status" placeholder="Chọn trạng thái">-->
      <!--          <el-option label="Đang mượn" value="Đang mượn" />-->
      <!--          <el-option label="Đã trả" value="Đã trả" />-->
      <!--          <el-option label="Quá hạn" value="Quá hạn" />-->
      <!--          <el-option label="Mất" value="Mất" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="Trạng thái đơn mượn">
        <el-tag :type="getStatusTagType(orderStore.selectedOrder?.status)" effect="dark" round size="large">
          {{ orderStore.selectedOrder?.status }}
        </el-tag>
      </el-form-item>
    </el-form>

    <el-table
      :data="orderStore.selectedOrder?.details || []"
      border
      empty-text="Không có dữ liệu"
      style="margin-top: 20px;"
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
      <el-table-column label="Tên sách" prop="title"/>
      <el-table-column label="Ngày hẹn trả" prop="return_date_due"/>

      <el-table-column label="Ngày trả thực tế" width="250px">
        <template #default="{ row }">
          <el-date-picker
            v-model="row.return_date_real"
            :disabled-date="disableDates(row.return_date_due)"
            :disabled-formatter="(date: Date) => date < new Date()"
            placeholder="Chọn ngày trả thực tế"
            type="date"
            @change="handleReturnDateChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Trạng thái" width="200">
        <template #default="{ row }">
          <el-select
            v-model="row.status"
            placeholder="Chọn trạng thái"
            @change="handleStatusChange(row)"
          >
            <el-option label="Đang mượn" :value="0" :disabled="isOptionDisabled('0', row.status)"/>
            <el-option label="Đã trả" :value="1"/>
            <el-option label="Quá hạn" :value="2"/>
            <el-option label="Mất" :value="3"/>
          </el-select>
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

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import Modal from "@/components/Admin/Common/Modal.vue";
import dayjs from 'dayjs';

import {useOrderStore} from "@/stores/Admin/order.store";
import {notifyError} from "@/composables/notifications";
import type {Order} from "@/types/Admin/order";
import {Delete, Search} from "@element-plus/icons-vue";

const orderStore = useOrderStore();
const fetchLoading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
const selectedDateRange = ref<[Date, Date] | null>(null);

const columns = [
  {prop: "full_name", label: "Tên người mượn", width: 200},
  {prop: "employee_code", label: "Mã nhân viên", width: 400, align: "center"},
  {prop: "created_at", label: "Ngày mượn", width: 300},
  {
    prop: "status",
    label: "Trạng thái",
    width: 250,
    formatter: (row: Order) => row.status
  },
  {prop: "actions", label: "Hành động", width: 125, align: "center"},
];

const formRules = {
  full_name: [{required: true, message: "Tên người mượn không được trống", trigger: "blur"}],
  employee_code: [{required: true, message: "Mã NV không được trống", trigger: "blur"}],
};

const order = reactive({
  id: 0,
  full_name: "",
  employee_code: "",
});

const handleFilter = () => {
  orderStore.pagination.current_page = 1;
  orderStore.fetchOrders();
};

const getStatusTagType = (status: string): string => {
  const statusTagTypes: Record<string, string> = {
    "Đang mượn": "primary",
    "Đã trả": "success",
    "Quá hạn": "warning",
    "Mất": "danger",
  };
  return statusTagTypes[status] ?? "info";
};

const isOptionDisabled = (option: string, status: string) => {
  if (option === 'Đang mượn' && status === 'Quá hạn') {
    return true;
  }
  return false;
};

const handleReturnDateChange = (row: any) => {
};

const handleStatusChange = (row: any) => {
};

const disableDates = (dueDate: string) => (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);

  return (
    time.getTime() < currentDate.getTime() ||
    time.getTime() > due.getTime()
  );
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

  const [start, end] = selectedDateRange.value || [];

  await orderStore.fetchOrders({
    start_date: start ? dayjs(start).format('YYYY-MM-DD') : undefined,
    end_date: end ? dayjs(end).format('YYYY-MM-DD') : undefined,
  });
};

// Submit
const handleSubmit = async () => {
  try {
    if (orderStore.selectedOrder) {
      const hasInvalidReturn = orderStore.selectedOrder.details.some(
        detail => detail.status === "Đã trả" && !detail.return_date_real
      );

      if (hasInvalidReturn) {
        notifyError("Vui lòng nhập ngày trả thực tế cho các sách có trạng thái 'Đã trả'");
        return;
      }

      const hasInvalidDate = orderStore.selectedOrder.details.some(detail => {
        if (!detail.return_date_real) return false;

        const returnDate = dayjs(detail.return_date_real);
        const dueDate = dayjs(detail.return_date_due);
        return returnDate.isAfter(dueDate);
      });

      // if (hasInvalidDate) {
      //   notifyError("Ngày trả thực tế không được vượt quá ngày hẹn trả");
      //   return;
      // }

      const payload = {
        details: orderStore.selectedOrder.details.map((detail) => ({
          id: detail.id,
          status: detail.status,
          return_date_real: detail.return_date_real
            ? dayjs(detail.return_date_real).format('YYYY-MM-DD')
            : null
        }))
      };

      await orderStore.updateOrder(order.id, payload);

      await orderStore.fetchOrderWithDetails(order.id);
      isModalVisible.value = false;
    }
  } catch (error) {
    notifyError("Cập nhật thất bại");
    console.log("handleSubmit error:", error);
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

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  width: 230px;
}

:deep(.filter) {
  width: 350px;
  height: 35px;
}

.admin-page__search-input {
  width: 300px;
}

.admin-page__search-container {
  width: 100%;
}

.filter-select {
  width: 180px !important;
}

:deep(.el-select__wrapper) {
  height: 37px;
}

:deep(.el-date-editor) {
  height: 37px;
  width: 100%;
}

.btn--primary {
  margin-left: 20px;
  padding: 9.5px 14px;
}
</style>
