<template>
  <div>
    <h1 class="admin-page__title">Quản lý đánh giá</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="reviewStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm đánh giá theo tên sách, người đánh giá, trạng thái"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>
      <div class="admin-page__heading--right">
        <Button
          v-if="selectedRows.length"
          class="btn btn--danger"
          @click="rejectSelectedReviews"
        >
          <el-icon class="btn--nicer"><Close /></el-icon>
          <span>Reject Selection</span>
        </Button>

        <Button
          v-if="selectedRows.length"
          class="btn btn--primary"
          @click="approveSelectedReviews"
        >
          <el-icon class="btn--nicer"><Check /></el-icon>
          <span>Approve Selection</span>
        </Button>
      </div>
    </div>

    <Table
      :columns="columns"
      :data="reviewStore.reviews"
      :row-class-name="getRowClass"
      :loading="fetchLoading"
      @selection-change="handleSelectionChange"
    >
      <template #user_name="{ row }">
        {{ row.user?.full_name || 'Unknown' }}
      </template>

      <template #book_title="{ row }">
        {{ row.book?.title || 'No Title' }}
      </template>

      <template #star="{ row }">
        <el-rate v-model="row.star" disabled></el-rate>
      </template>

      <template #status="{ row }">
        <template v-if="row.status !== 'Rejected'">
          <el-select v-model="row.status" placeholder="Chọn trạng thái" @change="handleStatusChange(row)" style="width: 120px">
            <el-option label="Pending" value="Pending"></el-option>
            <el-option label="Approved" value="Approved"></el-option>
            <el-option label="Rejected" value="Rejected"></el-option>
          </el-select>
        </template>
        <span v-else>{{ row.status }}</span>
      </template>
    </Table>

    <Pagination
      :pagination="reviewStore.pagination"
      @changePage="(page: number) => reviewStore.handlePageChange(page)"
    />

<!--    <Modal-->
<!--      :visible="deleteSelectedConfirmVisible"-->
<!--      :title="'Xác nhận xóa'"-->
<!--      @update:visible="deleteSelectedConfirmVisible = $event"-->
<!--      @submit="confirmDeleteSelectedCategories"-->
<!--      style="width: 500px"-->
<!--    >-->
<!--      <span>Bạn có chắc chắn muốn xóa đánh giá này?</span>-->
<!--    </Modal>-->

  </div>
</template>
<script lang="ts" setup>
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {Review} from '@/types/Admin/review';
import {onMounted, reactive, ref} from "vue";
import Modal from "@/components/Admin/Common/Modal.vue";
import {useReviewStore} from "@/stores/Admin/review.store";

const reviewStore = useReviewStore();
const fetchLoading = ref<boolean>(false);
const columns = [
  { prop: 'user_name', label: 'Người đánh giá', width: 200 },
  { prop: 'book_title', label: 'Tên sách', width: 250 },
  { prop: 'comment', label: 'Nhận xét', width: 450, type: 'string', lineClamp: 2 },
  { prop: 'star', label: 'Số sao', width: 180, type: 'number', align: 'center' },
  { prop: 'status', label: 'Trạng thái', width: 150, type: 'string', align: 'center' },
];

const formRules = {
  comment: [{ required: true, message: 'Comment is required', trigger: 'blur' }],
  star: [{ required: true, message: 'Star rating is required', trigger: 'blur' }],
  status: [{ required: true, message: 'Status is required', trigger: 'blur' }]
};

const review = reactive<Review>({
  id: '',
  comment: '',
  star: 1,
  status: 0
});

const getRowClass = ({ row }) => {
  return row.status === 'Rejected' ? 'row-rejected' : '';
};

const handleSearch = async () => {
  reviewStore.pagination.current_page = 1;
  try {
    await reviewStore.fetchReviews()
  } catch (error) {
    console.error("Failed to search reviews", error);
  } finally {
    fetchLoading.value = false;
  }
};

const statusMapping = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

const handleStatusChange = async (row) => {
  const payload = {
    id: row.id,
    status: statusMapping[row.status],
  };
  console.log("Updating status:", payload);
  await reviewStore.updateReview(row.id, payload);
};

const selectedRows = ref([]);
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};
const rejectSelectedReviews = async () => {
  const selectedIds = selectedRows.value.map((row) => row.id);
  await reviewStore.updateMultipleReviews(selectedIds, 'Rejected');
  selectedRows.value = [];
};

const approveSelectedReviews = async () => {
  const selectedIds = selectedRows.value.map((row) => row.id);
  await reviewStore.updateMultipleReviews(selectedIds, 'Approved');
  selectedRows.value = [];
};

onMounted(() => {
  reviewStore.fetchReviews();
});
</script>

<style lang="scss">
.row-rejected {
  color: #b2b2b2;
}
</style>
