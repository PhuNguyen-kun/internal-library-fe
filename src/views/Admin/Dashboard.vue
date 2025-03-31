<template>
  <h1 class="admin-page__title">Admin Dashboard</h1>
  <div class="chart__container">
    <div class="chart__container--row">
      <BarChart v-if="!loading" :chartData="chartDataBorrowers" :options="chartOptionsOne" class="chart__items"/>
      <BarChart v-if="!loading" :chartData="chartDataBooks" :options="chartOptionsTwo" class="chart__items"/>
      <p v-else>Loading...</p>
    </div>
    <div class="chart__container--row">
      <canvas id="favoriteBooksChart" class="chart__items"></canvas>
      <p v-if="loading">Loading...</p>
    </div>
    <div class="chart__container--row">
      <canvas id="pieChart" class="chart__items"></canvas>
      <canvas id="lineChart" class="chart__items"></canvas>
      <p v-if="loading">Loading...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useDashboardStore} from '@/stores/Admin/dashboard.store';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import BarChart from "@/components/Admin/Chart/BarChart.vue";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const lineChartInstance: ChartJS | null = null;
const pieChartInstance: ChartJS | null = null;

interface Borrower {
  full_name: string;
  orders_count: number;
}

interface Book {
  title: string;
  borrow_count: number;
}

interface Order {
  count: number;
}

const dashboardStore = useDashboardStore();
const topBorrowers = ref<Borrower[]>([]);
const topBorrowedBooks = ref<Book[]>([]);
const borrowedBooksByMonth = ref<Order[]>([]);
const borrowedBooksByMonthLabels = ref([]);
const booksByCategory = ref([]);
const mostFavoriteBooks = ref([]);
const {loading, fetchTopBorrowers, fetchTopBorrowedBooks, fetchBorrowedBooksByMonth, fetchBooksByCategory, fetchMostFavoriteBooks} = dashboardStore;

const chartDataBorrowers = computed(() => ({
  labels: topBorrowers.value.map(borrower => borrower.full_name),
  datasets: [
    {
      label: '',
      backgroundColor: 'orange',
      data: topBorrowers.value.map(borrower => borrower.orders_count),
    },
  ],
}));

const chartDataBooks = computed(() => ({
  labels: topBorrowedBooks.value.map(book => book.title),
  datasets: [
    {
      label: '',
      backgroundColor: '#4880FF',
      data: topBorrowedBooks.value.map(book => book.order_details_count),
    },
  ],
}));

const chartOptionsOne = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'Top 10 người mượn nhiều nhất',
      font: {
        size: 18,
        weight: '600',
        family: 'Nunito Sans, sans-serif',
      },
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    datalabels: false,
  },
};

const chartOptionsTwo = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'Top 10 sách mượn nhiều nhất',
      font: {
        size: 18,
        weight: '600',
        family: 'Nunito Sans, sans-serif',
      },
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    datalabels: false,
  },
};

// Line Chart
function renderLineChart() {
  const lineChartData = {
    labels: dashboardStore.borrowedBooksByMonthLabels,
    datasets: [
      {
        label: '',
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        data: borrowedBooksByMonth.value.map(order => order.count),
        fill: false,
        pointHoverRadius: 10
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Số lượng đơn mượn theo 12 tháng gần nhất',
        font: {
          size: 18,
          weight: '600',
          family: 'Nunito Sans, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      datalabels: false,
    },
  };

  const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }

      lineChartInstance = new ChartJS(ctx, {
        type: 'line',
        data: lineChartData,
        options: lineChartOptions,
      });
    }
  }
}

// Pie chart
function  renderPieChart() {
  const pieChartData = {
    labels: booksByCategory.value.map(category => category.name),
    datasets: [
      {
        label: 'Số lượng sách theo danh mục',
        data: booksByCategory.value.map(category => category.book_count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
        hoverOffset: 10,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Số lượng sách theo 10 danh mục được mượn nhiều nhất',
        font: {
          size: 18,
          weight: '600',
          family: 'Nunito Sans, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      datalabels: {
        color: '#fff', // Màu chữ
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        font: {
          weight: 'bold',
          size: 12,
          family: 'Nunito Sans, sans-serif',
        },
        anchor: 'end',
        align: 'start',
        offset: 35,
      },
    },
  };

  const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }

      pieChartInstance = new ChartJS(ctx, {
        type: 'pie',
        data: pieChartData,
        options: pieChartOptions,
      });
    }
  }
}

function renderFavoriteBooksChart() {
  const favoriteBooksChartData = {
    labels: mostFavoriteBooks.value.map(book => book.title),
    datasets: [
      {
        label: '',
        borderColor: '#FF6384',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: mostFavoriteBooks.value.map(book => book.favorite_count),
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 8
      },
    ],
  };

  const favoriteBooksChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top 30 sách được yêu thích nhất',
        font: {
          size: 18,
          weight: '600',
          family: 'Nunito Sans, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      datalabels: false,
    },
  };

  const canvas = document.getElementById('favoriteBooksChart') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }

      lineChartInstance = new ChartJS(ctx, {
        type: 'line',
        data: favoriteBooksChartData,
        options: favoriteBooksChartOptions,
      });
    }
  }
}

watch(
  () => booksByCategory.value,
  (newData) => {
    if (newData.length > 0) {
      console.log("Rendering pie chart with updated data:", newData);
      renderPieChart();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => mostFavoriteBooks.value,
  (newData) => {
    if (newData.length > 0) {
      console.log("Rendering most favorite books chart with updated data:", newData);
      renderFavoriteBooksChart();
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await fetchTopBorrowers();
  topBorrowers.value = dashboardStore.topBorrowers as Borrower[];

  await fetchTopBorrowedBooks();
  topBorrowedBooks.value = dashboardStore.topBorrowedBooks as Book[];

  await fetchBorrowedBooksByMonth();
  borrowedBooksByMonth.value = dashboardStore.borrowedBooksByMonth as Order[];

  await fetchBooksByCategory();
  booksByCategory.value = dashboardStore.booksByCategory;

  await fetchMostFavoriteBooks();
  mostFavoriteBooks.value = dashboardStore.mostFavoriteBooks;

  renderLineChart();
  renderPieChart();
  renderFavoriteBooksChart();
});
</script>

<style lang="scss" scoped>
.chart {
  &__container {
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #ffffff;
    padding: 40px 60px;

    &--row {
      display: flex;
      gap: 40px;
      margin-bottom: 60px;
    }

    &--row:last-child {
      margin-bottom: 0;
    }
  }

  &__items {
    width: 48%;
  }
}

#pieChart {
  max-width: 40%;
  height: auto;
}

#lineChart {
  max-width: 57%;
  height: auto;
}

#favoriteBooksChart {
  height: 450px;
}
</style>
