<template>
  <TheBreadCrumb />

  <div class="history">
    <h1 class="history__title">Lịch sử các đơn mượn</h1>
    <div class="history__content">
      <div class="history__content--date-range">
        <p>Chọn khoảng thời gian:</p>
        <el-date-picker
          v-model="selectedDateRange"
          type="daterange"
          unlink-panels
          range-separator="Đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
        />
        <div class="user-btn custom" @click="filterByDate">Xác nhận</div>
      </div>

      <div class="history__content--list">
        <div v-if="bookStore.borrowedBooks.length === 0" class="list__empty">
          Danh sách trống
        </div>

        <div v-for="order in bookStore.borrowedBooks" :key="order.id" class="history__order">
          <div class="order__header">
            <p><span>Mã nhân viên:</span> {{ order.employee_code }}</p>
            <p><span>Họ và tên:</span> {{ order.full_name }}</p>
            <p><span>Ngày tạo đơn:</span> {{ order.created_at }}</p>
            <p><span>Trạng thái: </span>
              <el-tag :type="getStatusTagType(order.status)" effect="dark" round>
                {{ order.status }}
              </el-tag>
            </p>
          </div>

          <div class="order__details">
            <div class="list__title">
              <div class="list__item--name">Tên sách</div>
              <div class="list__item--quantity">Số lượng</div>
              <div class="list__item--return-due">Ngày trả dự kiến</div>
              <div class="list__item--return-real">Ngày trả thực tế</div>
              <div class="list__item--status">Trạng thái</div>
            </div>

            <div v-for="book in order.details" :key="book.id" class="history__item">
              <div class="list__item--name">
                <img :src="book.image_url" alt="Book Image" class="list__item--image">
                <span>{{ book.title }}</span>
              </div>
              <div class="list__item--quantity">
                <span>{{ book.quantity }}</span>
              </div>
              <div class="list__item--return-due">
                <span>{{ book.return_date_due }}</span>
              </div>
              <div class="list__item--return-real">
                <el-date-picker
                  v-model="book.return_date_real"
                  type="date"
                  :disabled-date="disableDates(book.return_date_due)"
                  :disabled="book.status === 'Đã trả' && book.return_date_real !== null"
                  placeholder="Chọn ngày trả thực tế"
                />
                <div
                  v-if="errors[order.id] && errors[order.id][index]"
                  class="error-message"
                >
                  {{ errors[order.id][index] }}
                </div>
              </div>
              <div class="list__item--status">
                <el-select
                  v-model="book.status"
                  placeholder="Chọn trạng thái"
                  :disabled="book.status === 'Đã trả' && book.return_date_real !== null"
                >
                  <el-option label="Đang mượn" value="Đang mượn" />
                  <el-option label="Quá hạn" value="Quá hạn" />
                  <el-option label="Mất" value="Mất" />
                  <el-option label="Đã trả" value="Đã trả" />
                </el-select>
              </div>
            </div>
          </div>

          <div class="user-btn__container" v-if="!orderReturned(order)">
            <div class="cancel-btn" @click="cancelUpdateOrder">Hủy</div>
            <div class="user-btn" @click="handleUpdateOrder(order)">Xác nhận thay đổi</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import { useBookStore } from "@/stores/User/book.store";
import {useOrderStore} from "@/stores/Admin/order.store";
import { onMounted, ref, reactive} from "vue";
import dayjs from "dayjs";
import {notifyError, notifySuccess} from "@/composables/notifications";

const bookStore = useBookStore();
const orderStore = useOrderStore();
const dateRange = ref<[Date, Date] | null>(null);
const selectedDateRange = ref<[Date, Date] | null>(null);
const errors = reactive<Record<number, (string | null)[]>>({});

const getStatusTagType = (status: string): string => {
  const statusTagTypes: Record<string, string> = {
    "Đang mượn": "primary",
    "Đã trả": "success",
    "Quá hạn": "warning",
    "Mất": "danger",
  };
  return statusTagTypes[status] ?? "info";
};

const orderReturned = (order: any) => {
  return order.status === 'Đã trả';
};

const filterByDate = async () => {
  if (!selectedDateRange.value) {
    dateRange.value = null;
    await bookStore.fetchBorrowedBooks();
  } else {
    dateRange.value = selectedDateRange.value;

    const startDate = dateRange.value[0]?.toISOString().split("T")[0];
    const endDate = dateRange.value[1]?.toISOString().split("T")[0];

    await bookStore.fetchBorrowedBooks({ start_date: startDate, end_date: endDate });
  }
};

const handleUpdateOrder = async (order: any) => {
  try {
    const hasError = order.details.some((detail: any, index: number) => {
      if (detail.status === 'Đã trả' && !detail.return_date_real) {
        if (!errors[order.id]) {
          errors[order.id] = [];
        }
        errors[order.id][index] = "Vui lòng chọn ngày trả thực tế";
        return true;
      }

      if (detail.status === 'Đã trả' && detail.return_date_real) {
        errors[order.id][index] = null;
      }

      return false;
    });
    if (hasError) {
      notifyError("Vui lòng chọn ngày trả thực tế");
      return;
    }

    const payload = {
      details: order.details.map((detail: any) => ({
        id: detail.id,
        status: detail.status,
        return_date_real: detail.return_date_real
          ? dayjs(detail.return_date_real).format('YYYY-MM-DD')
          : null
      }))
    };

    console.log('Payload:', payload);

    await orderStore.updateOrder(order.id, payload);

    await bookStore.fetchBorrowedBooks();
  } catch (error) {
    notifyError("Cập nhật thất bại");
  }
};

const disableDates = (dueDate: string) => (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time để so sánh ngày

  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999); // Cho phép chọn đến hết ngày due

  return (
    time.getTime() < currentDate.getTime() ||
    time.getTime() > due.getTime()
  );
};

const cancelUpdateOrder = () => {
  bookStore.fetchBorrowedBooks();
};

onMounted(async () => {
  await bookStore.fetchBorrowedBooks();
});
</script>

<style scoped lang="scss">
.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.user-btn__container {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
  margin-top: -10px;
  padding-top: 20px;
  gap: 10px;
  border-top: 1px solid #ccc;
}

:deep(.el-range-editor) {
  margin-left: 250px;
}

.custom {
  height: 4px;
}

.history {
  &__title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  &__content {
    &--list {
      margin-top: 20px;
    }

    &--date-range {
      display: flex;
      align-items: center;
      margin-bottom: 50px;
      margin-top: 30px;
      gap: 15px;
    }
  }

  &__order {
    background: #fff;
    padding: 15px 15px 0 15px;
    margin-bottom: 40px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;

    .order {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f6f6f6;
        padding: 11px;
        border-radius: 5px;
        font-size: 14px;
        margin-bottom: 10px;

        span {
          font-weight: 500;
        }
      }

      &__details {
        padding: 10px;
      }
    }
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 15px 10px;
    border-bottom: 1px solid #ccc;

    &:last-child {
      border-bottom: none;
    }
  }
}

.list {
  &__title {
    display: flex;
    font-weight: 500;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    padding: 5px 10px 20px 10px;
    border-radius: 5px;
  }

  &__item {
    &--name {
      display: flex;
      align-items: center;
      flex: 1.6;

      img {
        width: 60px;
        height: 70px;
        margin-right: 20px;
      }
    }

    &--return-real {
      //flex: 1;
      width: 250px;
      text-align: center;
    }

    &--quanity {
      width: 80px;
    }

    &--status {
      width: 150px;
      text-align: center;
    }

    &--return-due {
      flex: 1;
      text-align: center;

    }
  }

  &__empty {
    padding: 1.3rem 2rem;
    font-size: 1rem;
    font-weight: 400;
    color: #888888;
    text-align: center;
    margin-top: 100px;
  }
}
</style>
