<template>
  <div>
    <h1 class="admin-page__title">Quản lý danh mục</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="searchTerm"
          placeholder="Tìm kiếm nhân viên theo tên danh mục"
          class="admin-page__search-input"
          @change="handleSearch"
          clearable
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>
      <div class="admin-page__heading--right">
        <Button class="btn btn--danger" v-if="selectedRows.length" @click="deleteSelectedCategories"
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

    <Table :data="categories" :columns="columns" :loading="fetchLoading" @selection-change="handleSelectionChange">
      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link type="primary" size="small" @click="openEditModal(row)">
            <img src="@/assets/img/Admin/edit.svg" alt="Edit"/>
          </el-button>
          <div class="divider"></div>
          <el-button link type="danger" size="small" @click="openDeleteConfirm(row.id)">
            <img src="@/assets/img/Admin/delete.svg" alt="Delete"/>
          </el-button>
        </div>
      </template>
    </Table>

    <Pagination
      :pagination="pagination"
      @changePage="handlePageChange"
    />

    <!--  Edit modal  -->
    <Modal
      :visible="editModalVisible"
      :title="'Chỉnh sửa danh mục'"
      @update:visible="editModalVisible = $event"
      @submit="confirmEdit"
      :formRef="editFormRef"
      style='width: 600px'>
      <el-form
        :model="editCategory"
        :rules="formRules"
        require-asterisk-position="right"
        label-position="top"
        ref="editFormRef">
        <el-form-item label="Tên danh mục" prop="name">
          <el-input v-model="editCategory.name" placeholder="Nhập tên danh mục"/>
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input v-model="editCategory.description" placeholder="Nhập mô tả" type="textarea" rows="10"/>
        </el-form-item>
      </el-form>
    </Modal>

    <!--  Create modal  -->
    <Modal
      :visible="createModalVisible"
      :title="'Thêm danh mục'"
      @update:visible="createModalVisible = $event"
      @submit="confirmCreate"
      @close="resetCreateform"
      :formRef="createFormRef"
      style="width: 600px"
    >
      <el-form
        :model="newCategory"
        :rules="formRules"
        ref="createFormRef"
        require-asterisk-position="right"
        label-position="top"
      >
        <el-form-item label="Tên danh mục" prop="name">
          <el-input v-model="newCategory.name" placeholder="Nhập tên danh mục"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input v-model="newCategory.description" placeholder="Nhập mô tả" type="textarea" rows="10"></el-input>
        </el-form-item>
      </el-form>
    </Modal>

    <!--  Delete confirm modal  -->
    <Modal
      :visible="deleteConfirmVisible"
      :title="'Xác nhận xóa danh mục'"
      @update:visible="deleteConfirmVisible = $event"
      @submit="confirmDelete"
      style='width: 500px'>
      <span>Bạn có chắc chắn muốn xóa danh mục này?</span>
    </Modal>

    <!--  Delete selected confirm modal  -->
    <Modal
      :visible="deleteSelectedConfirmVisible"
      :title="'Xác nhận xóa'"
      @update:visible="deleteSelectedConfirmVisible = $event"
      @submit="confirmDeleteSelectedCategories"
      style="width: 500px"
    >
      <span>Bạn có chắc chắn muốn xóa danh mục này?</span>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive } from "vue";
import Table from "@/components/Admin/Common/Table.vue";
import Button from "@/components/Admin/Common/Button.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import {getCategories, updateCategory, createCategory, deleteCategory} from "@/services/Admin/categoryService";
import {notifyError, notifySuccess} from "@/composables/notifications";
import Modal from "@/components/Admin/Common/Modal.vue";

const categories = ref([]);
const columns = [
  {prop: "name", label: "Tên danh mục", width: 350, type: "string"},
  {prop: "description", label: "Mô tả", width: 770, type: "string"},
  {prop: "actions", label: "Hành động", width: 125, align: "center"}
];

const formRules = {
  name: [
    {required: true, message: "Vui lòng nhập tên danh mục", trigger: ["blur", "change"]}
  ],
  description: [
    {required: true, message: "Vui lòng nhập mô tả", trigger: ["blur", "change"]}
  ]
};

const searchTerm = ref<string>("");
const fetchLoading = ref<boolean>(false);
const perPage = ref<number>(12);
const pagination = ref({
  current_page: 1,
  total: 0,
  total_pages: 1,
  per_page: perPage.value
});

const fetchCategories = async () => {
  fetchLoading.value = true;
  try {
    const response = await getCategories(searchTerm.value.trim(), perPage.value, pagination.value.current_page);
    categories.value = response.data;
    pagination.value = response.pagination;
    console.log(response);
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
  fetchLoading.value = false;
}

const handleSearch = async () => {
  pagination.value.current_page = 1;
  try {
    await fetchCategories()
  } catch (error) {
    console.error("Failed to search categories", error);
  } finally {
    fetchLoading.value = false;
  }
};

// Error handling function
const handleError = (error: any, context: string) => {

  console.error(`Error during ${context}:`, error);
  if (error.response && error.response.status === 422) {
    const validationErrors = error.response.data.errors;
    console.error('Validation errors:', validationErrors);
    Object.values(validationErrors).forEach((messages: string[]) => {
      messages.forEach((message: string) => notifyError(message));
    });
  } else {
    notifyError(`An error occurred during ${context}`);
  }
};

// Create Modal
const newCategory = reactive({
  name: "",
  description: ""
});

const resetCreateform = () => {
  newCategory.name = "";
  newCategory.description = "";
  createFormRef.value?.resetFields();
}

const createFormRef = ref(null);
const createModalVisible = ref(false);
const openCreateModal = () => {
  newCategory.name = "";
  newCategory.description = "";
  createFormRef.value?.resetFields();
  createModalVisible.value = true;
};

const confirmCreate = async () => {
  try {
    await createCategory(newCategory);
    notifySuccess('Danh mục được tạo thành công');
    await fetchCategories();
  } catch (error) {
    handleError(error, 'creating category');
  } finally {
    createModalVisible.value = false;
  }
}

// Edit modal
const editCategory = ref({
  id: null,
  name: "",
  description: ""
})
const editModalVisible = ref(false);
const editFormRef = ref(null);
const openEditModal = (category: any) => {
  editCategory.value = {...category};
  editModalVisible.value = true;
};
const confirmEdit = async () => {
  if (editCategory.value.id !== null) {
    try {
      await editFormRef.value.validate();
      await updateCategory(editCategory.value.id, editCategory.value);
      notifySuccess('Danh mục được cập nhật thành công');
      await fetchCategories();
    } catch (error) {
      handleError(error, 'updating category');
    } finally {
      editModalVisible.value = false;
    }
  }
}

// Delete
const categoryIDToDelete = ref<number>(null);
const deleteConfirmVisible = ref(false);
const openDeleteConfirm = (categoryID: number) => {
  categoryIDToDelete.value = categoryID;
  deleteConfirmVisible.value = true;
};
const confirmDelete = async () => {
  if (categoryIDToDelete.value !== null) {
    try {
      await deleteCategory(categoryIDToDelete.value);
      notifySuccess('Danh mục được xóa thành công');
      await fetchCategories();
    } catch (error) {
      notifyError('Xóa thất bại!')
    } finally {
      deleteConfirmVisible.value = false;
    }
  }
}

// Delete selected
const selectedRows = ref([]);
const deleteSelectedConfirmVisible = ref(false);
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log(selectedRows.value);
};
const deleteSelectedCategories = async () => {
  if (selectedRows.value.length === 0) {
    notifyError('Không có mục nào được chọn');
  }
  deleteSelectedConfirmVisible.value = true;
}
const confirmDeleteSelectedCategories = async () => {
  try {
    for (const category of selectedRows.value) {
      await deleteCategory(category.id);
    }
    notifySuccess('Danh mục được xóa thành công');
    await fetchCategories();
  } catch (error) {
    notifyError('Xóa danh mục thất bại!');
    console.error('Error deleting selected categories:', error);
  } finally {
    deleteSelectedConfirmVisible.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  fetchCategories();
};

onMounted(() => {
  fetchCategories();
});
</script>
