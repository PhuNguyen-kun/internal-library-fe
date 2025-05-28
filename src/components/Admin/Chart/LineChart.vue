<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, watch } from 'vue';
import { Chart as ChartJS, LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
});

let chartInstance = null;

onMounted(() => {
  const canvas = (refs.canvas as HTMLCanvasElement).getContext('2d');
  if (canvas) {
    chartInstance = new ChartJS(canvas, {
      type: 'line',
      data: props.chartData,
      options: props.options,
    });
  }
});

// Cập nhật biểu đồ nếu props thay đổi
watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData;
      chartInstance.update();
    }
  }
);

</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
