<template>
  <div>
    <h1 class="admin-page__title">Quản lý tác giả</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="authorStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm tác giả theo họ tên"
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
        <Button class="btn btn--primary" @click="openCreateModal">
          <el-icon class="btn--nicer" style="margin-top: -3px;">
            <Plus/>
          </el-icon>
          <span>Thêm danh mục</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="authorStore.authors" :loading="fetchLoading"
           @selection-change="handleSelectionChange">
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
      :pagination="authorStore.pagination"
      @changePage="(page: number) => authorStore.handlePageChange(page)"
    />

    <Modal
      :formRef="authorFormRef"
      :title="modalTitle"
      :visible="isModalVisible"
      style="width: 600px"
      @close="resetAuthorForm"
      @submit="handleSubmit"
      @update:visible="isModalVisible = $event"
    >
      <el-form
        ref="authorFormRef"
        :model="author"
        :rules="formRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item label="Tên tác giả" prop="name">
          <el-input v-model="author.name" placeholder="Nhập tên tác giả"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input v-model="author.description" placeholder="Nhập mô tả" rows="10" type="textarea"></el-input>
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
      <span>Bạn có chắc chắn muốn xóa tác giả này?</span>
    </Modal>

    <Modal
      :visible="deleteSelectedConfirmVisible"
      :title="'Xác nhận xóa'"
      @update:visible="deleteSelectedConfirmVisible = $event"
      @submit="confirmDeleteSelectedCategories"
      style="width: 500px"
    >
      <span>Bạn có chắc chắn muốn xóa tác giả này?</span>
    </Modal>

  </div>
</template>
<script lang="ts" setup>
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {Author} from '@/types/Admin/author';
import {onMounted, reactive, ref, watch} from "vue";
import Modal from "@/components/Admin/Common/Modal.vue";
import {useAuthorStore} from "@/stores/Admin/author.store";

const authorStore = useAuthorStore();
const fetchLoading = ref<boolean>(false);
const columns = [
  {prop: "name", label: "Tên tác giả", width: 350, type: "string"},
  {prop: "description", label: "Mô tả", width: 770, type: "string", lineClamp: 1},
  {prop: "actions", label: "Hành động", width: 125, align: "center"}
];

const formRules = {
  name: [
    {required: true, message: "Tên tác giả không được để trống", trigger: "blur"}
  ],
  description: [
    {required: true, message: "Mô tả không được để trống", trigger: "blur"}
  ]
};

const author = reactive({
  id: "",
  name: "",
  description: ""
});

const handleSearch = async () => {
  authorStore.pagination.current_page = 1;
  try {
    await authorStore.fetchAuthors()
  } catch (error) {
    console.error("Failed to search authors", error);
  } finally {
    fetchLoading.value = false;
  }
};

// Modal
const modalTitle = ref<string>("");
const authorFormRef = ref();
const isModalVisible = ref<boolean>(false);
const resetAuthorForm = () => {
  authorFormRef.value?.resetFields();
  authorStore.selectedAuthor = null;
};

const openCreateModal = () => {
  modalTitle.value = "Thêm tác giả";
  isModalVisible.value = true;
};

const openEditModal = (selectedAuthor: Author) => {
  authorStore.selectedAuthor = selectedAuthor;

  Object.assign(author, {
    id: selectedAuthor.id,
    name: selectedAuthor.name,
    description: selectedAuthor.description
  });

  modalTitle.value = "Chỉnh sửa tác giả";
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  if (authorStore.selectedAuthor) {
    await authorStore.updateAuthor(author.id, author);
  } else {
    await authorStore.createAuthor(author);
  }
  resetAuthorForm();
  isModalVisible.value = false;
};

// Delete confirm
const deleteConfirmVisible = ref<boolean>(false);
const deleteAuthorId = ref();
const openDeleteConfirm = (id: number) => {
  deleteAuthorId.value = id;
  deleteConfirmVisible.value = true;
  console.log(deleteAuthorId.value);
};
const handleDelete = () => {
  if (deleteAuthorId.value) {
    authorStore.deleteAuthor(deleteAuthorId.value);
    deleteConfirmVisible.value = false;
  }
};

// Delete selected
const selectedRows = ref([]);
const deleteSelectedConfirmVisible = ref(false);
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log(selectedRows.value);
};

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true;
}

const confirmDeleteSelectedCategories = async () => {
  const selectedIds = selectedRows.value.map((category: any) => category.id);
  await authorStore.deleteSelectedAuthors(selectedIds);
  deleteSelectedConfirmVisible.value = false;
};

onMounted(() => {
  authorStore.fetchAuthors();
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!authorStore.selectedAuthor) {
      Object.assign(author, {
        id: "",
        name: "",
        description: ""
      });
    }
  } else {
    resetAuthorForm();
  }
});
</script>
