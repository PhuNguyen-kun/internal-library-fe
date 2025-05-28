<template>
  <TheBreadCrumb />

  <div class="history">
    <h1 class="history__title">Lịch sử các đơn mượn</h1>
    <div class="history__content">
      <div class="history__content--date-range">
        <p class="date-range-text">Chọn đơn mượn theo:</p>
        <el-select
          v-model="bookStore.statusFilter"
          class="filter-select"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          placeholder="Trạng thái"
          style="width: 200px"
        >
          <el-option :value="0" label="Đang mượn" />
          <el-option :value="1" label="Đã trả" />
          <el-option :value="2" label="Quá hạn" />
          <el-option :value="3" label="Mất" />
        </el-select>

        <div class="date-range-pick">
          <el-date-picker
            :teleported="false"
            v-model="startDate"
            placeholder="Ngày bắt đầu"
            type="date"
          />
          <el-date-picker
            :teleported="false"
            v-model="endDate"
            :disabled-date="disableEndDates"
            placeholder="Ngày kết thúc"
            type="date"
          />
          <div class="user-btn custom" @click="filterByDate">Xác nhận</div>
        </div>
      </div>

      <div class="history__content--list">
        <div v-if="bookStore.borrowedBooks.length === 0" class="list__empty">Danh sách trống</div>

        <div v-for="order in bookStore.borrowedBooks" :key="order.id" class="history__order">
          <div class="order__header">
            <p class="employee-code"><span>Mã nhân viên:</span> {{ order.employee_code }}</p>
            <p class="full_name"><span>Họ và tên:</span> {{ order.full_name }}</p>
            <p class="no-responsive"><span>Ngày tạo đơn:</span> {{ order.created_at }}</p>
            <p class="responsive">{{ order.created_at }}</p>
            <p>
              <span>Trạng thái: </span>
              <el-tag
                :type="getStatusTagType(order.status)"
                effect="dark"
                round
                style="margin-bottom: 1px"
              >
                {{ order.status }}
              </el-tag>
            </p>
          </div>

          <div class="order__details no-responsive">
            <div class="list__title">
              <div class="list__item--name">Tên sách</div>
              <div class="list__item--quantity">Số lượng</div>
              <div class="list__item--return-due">Ngày trả dự kiến</div>
              <div class="list__item--return-real">Ngày trả thực tế</div>
              <div class="list__item--status">Trạng thái</div>
            </div>

            <div v-for="book in order.details" :key="book.id" class="history__item">
              <div class="list__item--name">
                <img :src="book.image_url" alt="Book Image" class="list__item--image" />
                <span :title="book.title" class="line-clamp-2">{{ book.title }}</span>
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
                  :disabled="isBookSelectDisabled[book.id]"
                  :disabled-date="disableDates(book.return_date_due)"
                  placeholder="Chọn ngày trả thực tế"
                  type="date"
                />
                <div v-if="errors[order.id] && errors[order.id][index]" class="error-message">
                  {{ errors[order.id][index] }}
                </div>
              </div>
              <div class="list__item--status">
                <el-select
                  v-model="book.status"
                  placeholder="Chọn trạng thái"
                  :disabled="isBookSelectDisabled[book.id]"
                >
                  <el-option
                    label="Đang mượn"
                    value="Đang mượn"
                    :disabled="book.status === 'Quá hạn'"
                  />
                  <el-option label="Quá hạn" value="Quá hạn" />
                  <el-option label="Mất" value="Mất" />
                  <el-option label="Đã trả" value="Đã trả" />
                </el-select>
              </div>
            </div>
          </div>

          <!--  For mobile   -->
          <div class="order__details--mobile responsive">
            <div v-for="book in order.details" :key="book.id" class="history__item">
              <div class="list__item--image-container">
                <img :src="book.image_url" alt="Book Image" class="list__item--image" />
              </div>
              <div class="list__item--info">
                <div class="list__item--name">
                  <span :title="book.title" class="line-clamp-2">{{ book.title }}</span>
                </div>
                <div class="list__item--info-right">
                  <div class="list__item--quantity">
                    <span>Số lượng: {{ book.quantity }}</span>
                  </div>
                  <div class="list__item--return-due">
                    <span>Ngày trả: {{ book.return_date_due }}</span>
                  </div>
                  <div class="list__item--return-real">
                    <el-date-picker
                      v-model="book.return_date_real"
                      :disabled-date="disableDates(book.return_date_due)"
                      placeholder="Chọn ngày trả thực tế"
                      type="date"
                      class="return-real-input"
                    />
                    <div v-if="errors[order.id] && errors[order.id][index]" class="error-message">
                      {{ errors[order.id][index] }}
                    </div>
                  </div>
                  <div class="list__item--status">
                    <el-select
                      v-model="book.status"
                      placeholder="Chọn trạng thái"
                      :disabled="orderReturned(order)"
                      class="status-input"
                    >
                      <el-option label="Đang mượn" value="Đang mượn" />
                      <el-option label="Quá hạn" value="Quá hạn" />
                      <el-option label="Mất" value="Mất" />
                      <el-option label="Đã trả" value="Đã trả" />
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!orderReturned(order)" class="user-btn__container">
            <div class="cancel-btn" @click="cancelUpdateOrder">Hủy</div>
            <div class="user-btn" @click="handleUpdateOrder(order)">Xác nhận thay đổi</div>
          </div>
        </div>
      </div>

      <Pagination
        :pagination="bookStore.historyPagination"
        @changePage="(page: number) => bookStore.handleHistoryPageChange(page)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheBreadCrumb from '@/components/User/Common/TheBreadCrumb.vue'
import { useBookStore } from '@/stores/User/book.store'
import { useOrderStore } from '@/stores/Admin/order.store'
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { notifyError } from '@/composables/notifications'
import Pagination from '@/components/User/Common/Pagination.vue'

const bookStore = useBookStore()
const orderStore = useOrderStore()
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const errors = reactive<Record<number, (string | null)[]>>({})

const getStatusTagType = (status: string): string => {
  const statusTagTypes: Record<string, string> = {
    'Đang mượn': 'primary',
    'Đã trả': 'success',
    'Quá hạn': 'warning',
    Mất: 'danger',
  }
  return statusTagTypes[status] ?? 'info'
}

const orderReturned = (order: any) => {
  return order.status === 'Đã trả'
}

const filterByDate = async () => {
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    notifyError('Ngày bắt đầu không thể lớn hơn ngày kết thúc')
    return
  }

  const formatDate = (date: Date | null): string | null => {
    if (!date) return null

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const formattedStartDate = formatDate(startDate.value)
  const formattedEndDate = formatDate(endDate.value)
  const status = bookStore.statusFilter.length > 0 ? bookStore.statusFilter.join(',') : null

  await bookStore.fetchBorrowedBooks({
    start_date: formattedStartDate,
    end_date: formattedEndDate,
    status: status,
  })
}

const disableEndDates = (time: Date) => {
  if (!startDate.value) {
    return false
  }

  const start = new Date(startDate.value)
  start.setHours(0, 0, 0, 0)

  return time.getTime() < start.getTime()
}

let isBookSelectDisabled = reactive<Record<number, boolean>>({})

const handleUpdateOrder = async (order: any) => {
  try {
    errors[order.id] = []

    const hasError = order.details.some((detail: any, index: number) => {
      if (detail.status === 'Đã trả' && !detail.return_date_real) {
        if (!errors[order.id]) {
          errors[order.id] = []
        }
        errors[order.id][index] = 'Vui lòng chọn ngày trả thực tế'
        return true
      }

      if (detail.status === 'Đã trả' && detail.return_date_real) {
        errors[order.id][index] = null
      }

      errors[order.id][index] = null

      return false
    })
    if (hasError) {
      notifyError('Vui lòng chọn ngày trả thực tế')
      return
    }

    const payload = {
      details: order.details.map((detail: any) => ({
        id: detail.id,
        status: detail.status,
        return_date_real: detail.return_date_real
          ? dayjs(detail.return_date_real).format('YYYY-MM-DD')
          : null,
      })),
    }

    await orderStore.updateOrder(order.id, payload)

    order.details.forEach((detail: any) => {
      if (detail.status === 'Đã trả') {
        isBookSelectDisabled[detail.id] = true
      }
    })

    localStorage.setItem('isBookSelectDisabled', JSON.stringify(isBookSelectDisabled))

    await bookStore.fetchBorrowedBooks()
  } catch (error) {
    notifyError('Cập nhật thất bại')
  }
}

const disableDates = (dueDate: string) => (time: Date) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999)

  return time.getTime() < currentDate.getTime() || time.getTime() > due.getTime()
}
const cancelUpdateOrder = () => {
  bookStore.fetchBorrowedBooks()
}

onMounted(async () => {
  const savedDisabledState = localStorage.getItem('isBookSelectDisabled')
  if (savedDisabledState) {
    isBookSelectDisabled = JSON.parse(savedDisabledState)
  }

  await bookStore.fetchBorrowedBooks()
})
</script>

<style lang="scss" scoped>
.date-range-pick {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

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

.custom {
  height: 4px;
  @media (max-width: 380px) {
    width: 27%;
    padding: 14px 6px;
  }

  @media (min-width: 380.2px) and (max-width: 528px) {
    width: 27%;
    padding: 14px 6px;
  }

  @media (min-width: 528.2px) and (max-width: 768px) {
    width: 21%;
    padding: 14px 6px;
  }

  @media (min-width: 768.2px) and (max-width: 1200px) {
    width: 20%;
    padding: 14px 6px;
  }
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
      gap: 10px;
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
    }

    &--image {
      width: 60px;
      height: 80px;
      object-fit: cover;
      margin-right: 20px;
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
    padding: 4.5rem 2rem;
    font-size: 1rem;
    font-weight: 400;
    color: #888888;
    text-align: center;
    margin-top: 100px;
  }
}

@media (max-width: 768px) {
  .history__order {
    padding: 10px;
  }

  .employee-code,
  .full_name {
    display: none;
  }

  .date-range-text {
    display: none;
  }

  :deep(.el-range-editor) {
    margin-left: 0;
  }

  .list__item--image {
    width: 75px;
    height: 120px;
    margin-right: 5px;
    object-fit: cover;
  }

  .list__item--info {
    width: 100%;
  }

  .list__item--info-right {
    color: #757575;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .list__item--name {
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .list__item--return-due {
    margin-left: 0;
  }

  .list__item--return-real {
    text-align: start;
  }

  .user-btn__container {
    justify-content: center;
  }
}

@media (max-width: 380px) {
  .date-range-pick {
    width: 100%;
  }

  .list__item--return-real {
    width: 100%;
  }

  .list__item--name {
    font-size: 15px;
  }

  .list__item--quantity,
  .list__item--return-due {
    font-size: 13px;
  }

  .list__item--image {
    width: 97px;
    height: 157px;
    background-color: #ccc;
    object-fit: cover;
  }

  .list__item--image-container {
    display: flex;
    align-items: center;
  }

  .history__item {
    gap: 10px;
  }
}

@media (min-width: 380.2px) and (max-width: 768px) {
  .date-range-pick {
    width: 100%;
  }

  .history__item {
    gap: 15px;
  }

  .list__item--image {
    width: 110px;
    height: 170px;
    background-color: #ccc;
    object-fit: cover;
  }
}

@media (min-width: 768.2px) and (max-width: 1199.8px) {
  //.date-range-pick, .date-range-text {
  //  width: 100%;
  //}

  .history__content--date-range {
    width: 100%;
  }

  .history__item {
    gap: 10px;
  }

  .list__item--image {
    width: 110px;
    height: 170px;
    background-color: #ccc;
    object-fit: cover;
  }

  .list__item--info {
    width: 100%;
  }

  .list__item--info-right {
    color: #757575;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .list__item--name {
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .list__item--return-due {
    margin-left: 0;
  }

  .list__item--return-real {
    text-align: start;
  }

  .user-btn__container {
    justify-content: center;
  }
}

@media (max-width: 1200px) {
  .list__item--info-right {
    gap: 10px;
  }
  .list__item--name {
    margin-top: 0;
    margin-bottom: 15px;
  }
  .history__item {
    padding: 20px 0 25px 0;
  }

  .list__item--return-due {
    text-align: start;
  }
  .list__item--return-real {
    text-align: start;
  }

  .user-btn__container {
    padding-top: 20px;
    padding-bottom: 10px;
    margin-top: 0;
  }
}

@media (min-width: 1025px) {
  .history {
    width: 800px;
  }
}

@media (min-width: 1440px) {
  .history {
    width: 1170px;
  }
}

:deep(.el-input__inner::placeholder) {
  opacity: 1 !important;
  color: #a8abb2 !important;
  text-align: center;
}

@media (max-width: 767.8px) {
  .history__content--date-range {
    flex-wrap: wrap;
  }
}

@media (min-width: 768px) and (max-width: 1200px) {
  .date-range-text {
    display: none;
  }
}
</style>

<style lang="scss">
.return-real-input {
  width: 180px !important;
}
.status-input {
  width: 120% !important;
}
</style>
