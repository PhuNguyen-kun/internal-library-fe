<template>
  <div>
    <h1 class="admin-page__title">Quản lý đơn mượn</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="orderStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>
      <div class="admin-page__heading--right">
        <Button v-if="selectedRows.length" class="btn btn--danger" @click="openDeleteSelectedConfirm"
        >
          <el-icon class="btn--nicer">
            <Delete/>
          </el-icon>
          <span>Xóa các mục đã chọn</span>
        </Button>
<!--        <Button class="btn btn&#45;&#45;primary" @click="openCreateModal">-->
<!--          <el-icon class="btn&#45;&#45;nicer" style="margin-top: -3px;">-->
<!--            <Plus/>-->
<!--          </el-icon>-->
<!--          <span>Thêm danh mục</span>-->
<!--        </Button>-->
      </div>
    </div>

    <Table :columns="columns" :data="orderStore.orders" :loading="fetchLoading"
           @selection-change="handleSelectionChange">
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ row.status }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditModal(row)">
            <img alt="Edit" src="@/assets/img/Admin/edit.svg"/>
          </el-button>
          <div class="divider"></div>
          <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
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
    style="width: 600px"
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
      <el-form-item label="Tên người mượn" prop="name">
        <el-input v-model="order.full_name" placeholder="Nhập tên đơn mượn"></el-input>
      </el-form-item>
      <el-form-item label="Mã nhân viên" prop="description">
        <el-input v-model="order.employee_code" placeholder="Nhập mã nhân viên" rows="10"></el-input>
      </el-form-item>
      <el-form-item label="Trạng thái" prop="description">
        <el-input v-model="order.status" placeholder="Chọn trạng thái" rows="10"></el-input>
      </el-form-item>
    </el-form>
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

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelectedOrders"
    style="width: 500px"
  >
    <span>Bạn có chắc chắn muốn xóa đơn mượn này?</span>
  </Modal>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type { Order } from "@/types/Admin/order";
import Modal from "@/components/Admin/Common/Modal.vue";
import { useOrderStore} from "@/stores/Admin/order.store";

const orderStore = useOrderStore();
const fetchLoading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
const columns = [
  {prop: "full_name", label: "Tên người mượn", width: 350},
  {prop: 'employee_code', label: "Mã nhân viên", width: 250, type: "string"},
  {prop: "created_at", label: "Ngày mượn", width: 270, type: "string"},
  {prop: "status", label: "Trạng thái", width: 250, type: "string"},
  {prop: "actions", label: "Hành động", width: 125, align: "center"}
]
const formRules = {
  full_name: [
    {required: true, message: "Tên người mượn không được để trống", trigger: "blur"}
  ],
  employee_code: [
    {required: true, message: "Mã NV không được để trống", trigger: "blur"}
  ]
};

const order = reactive({
  id: 0,
  full_name: "",
  employee_code: "",
  status: "",
})

const getStatusTagType = (status: string): string => {
  const statusTagTypes: { [key: string]: string } = {
    'Đang mượn': 'primary',
    'Đã trả': 'success',
    'Quá hạn': 'warning',
    'Mất': 'danger',
  };
  return statusTagTypes[status] ?? 'info';
};

// Modal
const openEditModal = (selectedOrder: Order) => {
  orderStore.selectedOrder = selectedOrder;

  Object.assign(order, {
    id: selectedOrder.id,
    full_name: selectedOrder.full_name,
    employee_code: selectedOrder.employee_code,
    status: selectedOrder.status
  });

  orderStore.modalTitle = "Chỉnh sửa đơn mượn";
  isModalVisible.value = true;
};

// Delete confirm
const deleteConfirmVisible = ref<boolean>(false);
const deleteOrderId = ref();
const openDeleteConfirm = (id: number) => {
  deleteOrderId.value = id;
  deleteConfirmVisible.value = true;
  console.log(deleteOrderId.value);
};
const handleDelete = () => {
  if (deleteOrderId.value) {
    orderStore.deleteOrder(deleteOrderId.value);
    deleteConfirmVisible.value = false;
  }
};

// Delete selected
const selectedRows = ref([]);
const deleteSelectedConfirmVisible = ref<boolean>(false);
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log(selectedRows.value);
};

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true;
}

const confirmDeleteSelectedOrders = async () => {
  const selectedIds = selectedRows.value.map((order: any) => order.id);
  await orderStore.deleteSelectedOrders(selectedIds);
  deleteSelectedConfirmVisible.value = false;
};

const handleSearch = async () => {
  orderStore.pagination.current_page = 1;
  await orderStore.fetchOrders();
};

const handleSubmit = async () => {
  if (orderStore.selectedOrder) {
    await orderStore.updateOrder(order.id, order);
  } else {
    await orderStore.createOrder(order);
  }
  orderStore.resetForm();
  isModalVisible.value = false;
};

onMounted( () => {
  orderStore.fetchOrders();
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!orderStore.selectedOrder) {
      Object.assign(order, {
        id: "",
        name: "",
        description: ""
      });
    }
  } else {
    orderStore.resetForm();
  }
});

</script>
