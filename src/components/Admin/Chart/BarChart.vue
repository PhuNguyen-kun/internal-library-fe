<template>
  <div>
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { ChartData, ChartOptions } from 'chart.js';

interface Props {
  chartData: ChartData;
  options: ChartOptions;
}

const props = defineProps<Props>();
</script>

<style scoped>
div {
  height: 400px;
}
</style>
