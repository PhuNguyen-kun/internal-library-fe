<template>
  <el-table :data="data" style="width: 100%; border-radius: 15px; border: 1px solid #ccc" header-row-class-name="table-title" class="table-checkbox"
  v-loading="loading">
    <el-table-column
      type="selection"
      width="65"
      :selectable="selectable"
      align="center"
    ></el-table-column>

    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :align="column.align || 'left'"
      :fixed="column.fixed ? 'left' : undefined"
    >
      <template #default="scope" v-if="column.type === 'checkbox'">
        <el-checkbox v-model="scope.row[column.prop]"/>
      </template>
      <template v-if="$slots[column.prop]" #default="scope">
        <slot :name="column.prop" :row="scope.row" :index="scope.$index" />
      </template>
      <template v-else #default="scope">
        {{ scope.row[column.prop] }}
      </template>

    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {PropType} from "vue"

type ColumnType = 'number' | 'string' | 'checkbox'

interface IColumn {
  prop: string,
  label: string,
  width: number,
  type: ColumnType,
  align?: "left" | "center" | "right";
  fixed?: boolean;
}

defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<IColumn[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss">
.el-table__inner-wrapper {
  border-radius: 20px;
}

.table-title {
  height: 45px;
  font-weight: 800;
  font-size: 16px;
  color: #000;
}

.table-checkbox .el-checkbox__input {
  border: 1px solid #ccc; /* Viền đậm */
  border-radius: 2px; /* Bo góc */
  width: 14px;
  height: 14px;
}

.table-checkbox .el-checkbox__input.is-checked {
  background-color: #4880ff; /* Màu nền khi được chọn */
  border-color: #333;
}

.table-checkbox .el-checkbox__input:hover {
  border-color: #555; /* Đậm hơn khi hover */
}

</style>
