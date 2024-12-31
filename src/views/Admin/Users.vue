<template>
  <div>
    <h1 class="admin-page__title">Quản lý người dùng</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="userStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm người dùng theo họ tên, email"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>
      <div class="admin-page__heading--right">
        <Button v-if="selectedRows.length" class="btn btn--danger" @click="openBlockSelectedConfirm"
        >
          <el-icon><Flag /></el-icon>
          <span>Chặn người dùng đã chọn</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="userStore.users" :loading="fetchLoading"
           @selection-change="handleSelectionChange">
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status).type" :effect="getStatusTagType(row.status).effect">
          {{ row.status }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditModal(row)">
            <img alt="Edit" src="@/assets/img/Admin/edit.svg"/>
          </el-button>
          <div class="divider"></div>
          <el-button link type="danger" @click="openBlockConfirm(row.id)">
            <el-icon><Flag /></el-icon>
          </el-button>
        </div>
      </template>
    </Table>

    <Pagination
      :pagination="userStore.pagination"
      @changePage="(page: number) => userStore.handlePageChange(page)"
    />

    <Modal
      :formRef="userFormRef"
      :title="modalTitle"
      :visible="isModalVisible"
      style="width: 600px"
      @close="resetUserForm"
      @submit="handleSubmit"
      @update:visible="isModalVisible = $event"
    >
      <el-form
        ref="userFormRef"
        :model="user"
        :rules="formRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item label="Tên người dùng" prop="full_name">
          <el-input v-model="user.full_name" placeholder="Nhập tên người dùng"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" placeholder="Nhập email"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone_number">
          <el-input v-model="user.phone_number" placeholder="Nhập số điện thoại"></el-input>
        </el-form-item>
        <el-form-item label="Giới tính" prop="gender">
          <el-radio-group v-model="user.gender">
            <el-radio label="Nam">Nam</el-radio>
            <el-radio label="Nữ">Nữ</el-radio>
            <el-radio label="Khác">Khác</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Ngày sinh" prop="birth_date">
          <el-date-picker v-model="user.birth_date" type="date" placeholder="Chọn ngày sinh"></el-date-picker>
        </el-form-item>
        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="user.address" placeholder="Nhập địa chỉ"></el-input>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <el-radio-group v-model="user.status">
            <el-radio label="Active">Active</el-radio>
            <el-radio label="Inactive">In active</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Modal>

    <Modal
      :title="'Xác nhận chặn'"
      :visible="blockConfirmVisible"
      style="width: 500px"
      @submit="handleBlock"
      @update:visible="blockConfirmVisible = $event"
    >
      <span>Bạn có chắc chắn muốn chặn người dùng này?</span>
    </Modal>

    <Modal
      :visible="blockSelectedConfirmVisible"
      :title="'Xác nhận chặn'"
      @update:visible="blockSelectedConfirmVisible = $event"
      @submit="confirmBlockSelectedCategories"
      style="width: 500px"
    >
      <span>Bạn có chắc chắn muốn chặn người dùng này?</span>
    </Modal>

  </div>
</template>
<script lang="ts" setup>
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {User} from '@/types/Admin/user';
import {onMounted, reactive, ref, watch} from "vue";
import Modal from "@/components/Admin/Common/Modal.vue";
import {useUserStore} from "@/stores/Admin/user.store";

const userStore = useUserStore();
const fetchLoading = ref<boolean>(false);
const columns = [
  {prop: "full_name", label: "Tên người dùng", width: 250, type: "string", fixed: "left"},
  {prop: "email", label: "Email", width: 280, type: "string"},
  {prop: "phone_number", label: "Số điện thoại", width: 170, type: "string"},
  {prop: "gender", label: "Giới tính", width: 120, type: "string", align: "center"},
  {prop: "birth_date", label: "Ngày sinh", width: 200, type: "string", align: "center"},
  {prop: "address", label: "Địa chỉ", width: 300, type: "string", lineClamp: 2},
  {prop: "status", label: "Trạng thái", width: 170, type: "string"},
  {prop: "actions", label: "Hành động", width: 125, type: "string", fixed: "right"}
];

const formRules = {
  full_name: [
    {required: true, message: "Tên người dùng không được để trống", trigger: "blur"}
  ],
  email: [
    {
      required: true,
      message: "Email không được để trống",
      trigger: ["blur", "change"]
    },
    {
      pattern: /^(kiaisoft\..+|.+@kiaisoft\.com)$/,
      message: "Email không hợp lệ. Cần có hậu tố \"@kiaisoft.com\" hoặc tiền tố \"kiaisoft.\"",
      trigger: ["blur", "change"]
    }
  ],
  phone_number: [
    {required: true, message: "Số điện thoại không được để trống", trigger: "blur"}
  ],
  gender : [
    {required: true, message: "Giới tính không được để trống", trigger: "blur"}
  ],
  birth_date: [
    {required: true, message: "Ngày sinh không được để trống", trigger: "blur"}
  ],
  address: [
    {required: true, message: "Địa chỉ không được để trống", trigger: "blur"}
  ],
  status: [
    {required: true, message: "Trạng thái không được để trống", trigger: "blur"}
  ]
};

const user = reactive({
  id: "",
  full_name: "",
  email: "",
  phone_number: "",
  gender: "",
  birth_date: "",
  address: "",
  status: ""
});

const getStatusTagType = (status: string): { type: string, effect: string } => {
  const statusTagTypes: { [key: string]: { type: string, effect: string } } = {
    'In active': { type: 'danger', effect: 'dark' },
    'Active': { type: 'success', effect: 'dark' },
  };
  return statusTagTypes[status] ?? { type: 'info', effect: 'dark' };
};
const handleSearch = async () => {
  userStore.pagination.current_page = 1;
  try {
    await userStore.fetchUsers()
  } catch (error) {
    console.error("Failed to search users", error);
  } finally {
    fetchLoading.value = false;
  }
};

// Modal
const modalTitle = ref<string>("");
const userFormRef = ref();
const isModalVisible = ref<boolean>(false);
const resetUserForm = () => {
  userFormRef.value?.resetFields();
  userStore.selectedUser = null;
};

const openEditModal = (selectedUser: User) => {
  userStore.selectedUser = selectedUser;

  Object.assign(user, {
    id: selectedUser.id,
    full_name: selectedUser.full_name,
    email: selectedUser.email,
    phone_number: selectedUser.phone_number,
    gender: selectedUser.gender,
    birth_date: selectedUser.birth_date,
    address: selectedUser.address,
    status: selectedUser.status
  });

  modalTitle.value = "Chỉnh sửa người dùng";
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  if (userStore.selectedUser) {
    await userStore.updateUser(user.id, user);
  } else {
    await userStore.createUser(user);
  }
  resetUserForm();
  isModalVisible.value = false;
};

// Block confirm
const blockConfirmVisible = ref<boolean>(false);
const blockUserId = ref();
const openBlockConfirm = (id: number) => {
  blockUserId.value = id;
  blockConfirmVisible.value = true;
  console.log(blockUserId.value);
};
const handleBlock = async () => {
  if (blockUserId.value) {
    await userStore.blockUser(blockUserId.value);
    blockConfirmVisible.value = false;
  }
};

// Block selected
const selectedRows = ref([]);
const blockSelectedConfirmVisible = ref(false);
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log(selectedRows.value);
};

const openBlockSelectedConfirm = async () => {
  blockSelectedConfirmVisible.value = true;
}

const confirmBlockSelectedCategories = async () => {
  const selectedIds = selectedRows.value.map((user: any) => user.id);
  await userStore.blockSelectedUsers(selectedIds);
  blockSelectedConfirmVisible.value = false;
};

onMounted(() => {
  userStore.fetchUsers();
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!userStore.selectedUser) {
      Object.assign(user, {
        id: "",
        full_name: "",
        email: "",
        phone_number: "",
        gender: "",
        birth_date: "",
        address: "",
        status: ""
      });
    }
  } else {
    resetUserForm();
  }
});
</script>
