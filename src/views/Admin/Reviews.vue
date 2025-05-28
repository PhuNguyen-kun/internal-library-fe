<template>
  <div>
    <h1 class="admin-page__title">Quản lý đánh giá</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="reviewStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm đánh giá theo tên sách, người đánh giá"
          @change="handleSearch"
        />

        <el-select
          v-model="reviewStore.selectedStars"
          placeholder="Lọc theo sao"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
          class="star-filter"
        >
          <el-option
            v-for="star in 5"
            :key="star"
            :label="`${star} ⭐`"
            :value="star"
          />
        </el-select>

        <el-select
          v-model="reviewStore.selectedStatus"
          placeholder="Lọc theo trạng thái"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
        >
          <el-option
            v-for="status in statusOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>

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
          <el-icon class="btn--nicer">
            <Close/>
          </el-icon>
          <span>Từ chối tất cả</span>
        </Button>

        <Button
          v-if="selectedRows.length"
          class="btn btn--primary"
          @click="approveSelectedReviews"
        >
          <el-icon class="btn--nicer">
            <Check/>
          </el-icon>
          <span>Duyệt tất cả</span>
        </Button>
      </div>
    </div>

    <Table
      :columns="columns"
      :data="reviewStore.reviews"
      :loading="fetchLoading"
      :row-class-name="getRowClass"
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
        <el-select v-model="row.status" placeholder="Chọn trạng thái" style="width: 133px"
                   @change="handleStatusChange(row)">
          <el-option label="Chờ xử lý" value="Pending" :disabled="row.status === 'Approved' || row.status === 'Rejected'"></el-option>
          <el-option label="Đã phê duyệt" value="Approved"></el-option>
          <el-option label="Bị từ chối" value="Rejected"></el-option>
        </el-select>
      </template>
    </Table>

    <Pagination
      :pagination="reviewStore.pagination"
      @changePage="(page: number) => reviewStore.handlePageChange(page)"
    />
  </div>
</template>
<script lang="ts" setup>
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {Review} from '@/types/Admin/review';
import {onMounted, reactive, ref} from "vue";
import {useReviewStore} from "@/stores/Admin/review.store";

const reviewStore = useReviewStore();
const fetchLoading = ref<boolean>(false);
const columns = [
  {prop: 'user_name', label: 'Người đánh giá', width: 200},
  {prop: 'book_title', label: 'Tên sách', width: 250},
  {prop: 'comment', label: 'Nhận xét', width: 450, type: 'string', lineClamp: 2},
  {prop: 'star', label: 'Số sao', width: 180, type: 'number', align: 'center'},
  {prop: 'status', label: 'Trạng thái', width: 150, type: 'string', align: 'center'},
];

const formRules = {
  comment: [{required: true, message: 'Comment is required', trigger: 'blur'}],
  star: [{required: true, message: 'Star rating is required', trigger: 'blur'}],
  status: [{required: true, message: 'Status is required', trigger: 'blur'}]
};

const review = reactive<Review>({
  id: '',
  comment: '',
  star: 1,
  status: 0
});

const getRowClass = ({row}) => {
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

const statusOptions = [
  { label: 'Chờ xử lý', value: 0 },
  { label: 'Đã phê duyệt', value: 1 },
  { label: 'Bị từ chối', value: 2 }
];

const handleFilter = () => {
  reviewStore.pagination.current_page = 1;
  reviewStore.fetchReviews();
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

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  width: 320px !important;
}
.admin-page__search-container {
  width: 830px;
}
:deep(.el-select__wrapper) {
  height: 37px;
}

.star-filter {
  width: 800px !important;
}
</style>
