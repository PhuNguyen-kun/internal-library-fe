<template>
  <div>
    <h1 class="admin-page__title">Quản lý nhà xuất bản</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="publisherStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm nhà xuất bản theo họ tên"
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
          <span>Thêm nhà xuất bản</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="publisherStore.publishers" :loading="fetchLoading"
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
      :pagination="publisherStore.pagination"
      @changePage="(page: number) => publisherStore.handlePageChange(page)"
    />
  </div>

  <Modal
    :formRef="publisherFormRef"
    :title="modalTitle"
    :visible="isModalVisible"
    style="width: 600px"
    @close="resetPublisherForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
  >
    <el-form
      ref="publisherFormRef"
      :model="publisher"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên nhà xuất bản" prop="name">
        <el-input v-model="publisher.name" placeholder="Nhập tên nhà xuất bản"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description">
        <el-input v-model="publisher.description" placeholder="Nhập mô tả" rows="10" type="textarea"></el-input>
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
    <span>Bạn có chắc chắn muốn xóa nhà xuất bản này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelectedPublishers"
    style="width: 500px"
  >
    <span>Bạn có chắc chắn muốn xóa nhà xuất bản này?</span>
  </Modal>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type { Publisher } from "@/types/Admin/publisher";
import Modal from "@/components/Admin/Common/Modal.vue";
import { usePublisherStore} from "@/stores/Admin/publisher.store";

const publisherStore = usePublisherStore();
const fetchLoading = ref<boolean>(false);
const columns = [
  {prop: "name", label: "Tên nhà xuất bản", width: 350, type: "string"},
  {prop: "description", label: "Mô tả", width: 770, type: "string", lineClamp: 1},
  {prop: "actions", label: "Hành động", width: 125, align: "center"}
]
const formRules = {
  name: [
    {required: true, message: "Tên nhà xuất bản không được để trống", trigger: "blur, change"}
  ],
  description: [
    {required: true, message: "Mô tả không được để trống", trigger: "blur, change"}
  ]
};

const publisher = reactive({
  id: 0,
  name: "",
  description: ""
})

// Modal
const modalTitle = ref<string>("");
const publisherFormRef = ref();
const isModalVisible = ref<boolean>(false);
const resetPublisherForm = () => {
  publisherFormRef.value?.resetFields();
  publisherStore.selectedPublisher = null;
};
const openCreateModal = () => {
  modalTitle.value = "Thêm nhà xuất bản";
  isModalVisible.value = true;
};

const openEditModal = (selectedPublisher: Publisher) => {
  publisherStore.selectedPublisher = selectedPublisher;

  Object.assign(publisher, {
    id: selectedPublisher.id,
    name: selectedPublisher.name,
    description: selectedPublisher.description
  });

  modalTitle.value = "Chỉnh sửa nhà xuất bản";
  isModalVisible.value = true;
};

// Delete confirm
const deleteConfirmVisible = ref<boolean>(false);
const deletePublisherId = ref();
const openDeleteConfirm = (id: number) => {
  deletePublisherId.value = id;
  deleteConfirmVisible.value = true;
  console.log(deletePublisherId.value);
};
const handleDelete = () => {
  if (deletePublisherId.value) {
    publisherStore.deletePublisher(deletePublisherId.value);
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

const confirmDeleteSelectedPublishers = async () => {
  const selectedIds = selectedRows.value.map((publisher: any) => publisher.id);
  await publisherStore.deleteSelectedPublishers(selectedIds);
  deleteSelectedConfirmVisible.value = false;
};

const handleSearch = async () => {
  publisherStore.pagination.current_page = 1;
  await publisherStore.fetchPublishers();
};

const handleSubmit = async () => {
  if (publisherStore.selectedPublisher) {
    await publisherStore.updatePublisher(publisher.id, publisher);
  } else {
    await publisherStore.createPublisher(publisher);
  }
  resetPublisherForm();
  isModalVisible.value = false;
};

onMounted( () => {
   publisherStore.fetchPublishers();
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!publisherStore.selectedPublisher) {
      Object.assign(publisher, {
        id: "",
        name: "",
        description: ""
      });
    }
  } else {
    resetPublisherForm();
  }
});

</script>
