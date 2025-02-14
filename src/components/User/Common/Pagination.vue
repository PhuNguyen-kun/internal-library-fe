<template>
  <div class="pagination-container">
<!--    <div class="pagination-info">-->
<!--      Showing {{ start }}-{{ end }} of {{ pagination.total }}-->
<!--    </div>-->

    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      v-model:current-page="pagination.current_page"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElPagination } from "element-plus";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

const props = defineProps<{
  pagination: Pagination;
}>();

const emit = defineEmits<{
  (e: 'changePage', page: number): void;
}>();

const start = computed(() => {
  return (props.pagination.current_page - 1) * props.pagination.per_page + 1;
});

const end = computed(() => {
  return Math.min(props.pagination.current_page * props.pagination.per_page, props.pagination.total);
});

function handlePageChange(page: number) {
  emit('changePage', page);
}
</script>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: -40px;
}

.pagination-info {
  font-size: 14px;
}

:deep(.is-active) {
  background-color: var(--user-theme-color) !important;
}

:deep(.el-pager) {
  li:hover {
    color: var(--user-theme-color) !important;
  }
}
</style>

<style lang="scss">
.el-pagination.is-background .el-pager li {
  background-color: white;
}

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev {
  background-color: white;
}
</style>

