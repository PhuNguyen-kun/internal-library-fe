<template>
  <el-table :data="data" style="width: 100%" border>
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
        <el-checkbox v-model="scope.row[column.prop]" />
      </template>
      <template #default="scope" v-else>
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
});
</script>

<style scoped lang="scss"></style>
