<template>
  <div>
    <TheBreadCrumb/>
  </div>

  <div class="cart-for-pc">
    <el-row :gutter="20" class="cart__title">
      <el-col :span="10">Tên sách</el-col>
      <el-col :span="4" align="center">SL trong kho</el-col>
      <el-col :span="4" align="center">Số lượng mượn</el-col>
      <el-col :span="6" align="center">Ngày trả</el-col>
    </el-row>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">Giỏ hàng trống</div>
      <template v-for="item in cartStore.cart" :key="item.id" >
    <el-row :gutter="20" class="cart__item" :class="{'out-of-stock': !isStockAvailable(item) }">
<!--        <div :class="{'out-of-stock': !isStockAvailable(item) }" class="cart__item">-->
          <el-col :span="10">
            <router-link
              :to="'/books/' + item.book.slug"
              class="cart__item--name no-text-decoration__strong"
              @mouseleave="hideDeleteButton(item.id)"
              @mouseover="showDeleteButton(item.id)"
            >
              <div class="image-container">
                <img :src="item.book.image_url" alt="Book Image" class="cart__item--image"/>
                <!--  Delete button -->
                <div
                  v-show="hoveredItemId === item.id"
                  class="delete-btn"
                  @click.prevent.stop="showDeleteDialog(item)"
                >
                  <img alt="Delete" src="@/assets/img/User/delete-cart-item-btn.svg"/>
                </div>
              </div>
              <span :title="item.book.title" class="line-clamp-2">{{ item.book.title }}</span>
            </router-link>
          </el-col>
          <el-col :span="4" align="center">
            <span>{{ item.book.stock_quantity }}</span>
          </el-col>
          <el-col :span="4" class="" align="center">
            <div class="quantity-input">
              <div class="input-field">{{ item.quantity }}</div>
              <div class="button">
                <button class="btn" @click="increaseQuantity(item.id)">
                  <el-icon>
                    <ArrowUp/>
                  </el-icon>
                </button>
                <button class="btn" @click="handleDecreaseQuantity(item)">
                  <el-icon>
                    <ArrowDown/>
                  </el-icon>
                </button>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="cart__item--date">
            <el-date-picker
              v-model="item.return_date_due"
              :class="{ 'error-border': errors[item.id] }"
              :disabled-date="disablePastDates"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày trả"
              type="date"
              value-format="YYYY-MM-DD"
              @change="handleDateChange(item.id, item.return_date_due)"
            />
            <div v-if="errors[item.id]" class="error-message">
              {{ errors[item.id] }}
            </div>
          </el-col>
<!--        </div>-->

        <div
          v-if="cartStore.outOfStockItems.includes(item.book.id)"
          class="quantity__error-message"
        >
          Số lượng tồn kho không đủ (Còn {{ item.book.stock_quantity }} quyển)
        </div>
    </el-row>
      </template>
  </div>

  <div class="cart cart-container">
    <div class="cart__title">
      <div class="cart__item--name">Tên sách</div>
      <div class="cart__item--stock">SL trong kho</div>
      <div class="cart__item--quantity">Số lượng mượn</div>
      <div class="cart__item--date">Ngày trả</div>
    </div>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">Giỏ hàng trống</div>
    <div class="cart__items">
      <div v-for="item in cartStore.cart" :key="item.id" class="cart__items">
        <div :class="{'out-of-stock': !isStockAvailable(item) }" class="cart__item">
          <router-link
            :to="'/books/' + item.book.slug"
            class="cart__item--name no-text-decoration__strong"
            @mouseleave="hideDeleteButton(item.id)"
            @mouseover="showDeleteButton(item.id)"
          >
            <div class="image-container">
              <img :src="item.book.image_url" alt="Book Image" class="cart__item--image"/>
              <!--  Delete button -->
              <div
                v-show="hoveredItemId === item.id"
                class="delete-btn"
                @click.prevent.stop="showDeleteDialog(item)"
              >
                <img alt="Delete" src="@/assets/img/User/delete-cart-item-btn.svg"/>
              </div>
            </div>
            <span :title="item.book.title" class="line-clamp-2">{{ item.book.title }}</span>
          </router-link>
          <div class="cart__item--right-container">
            <div class="cart__item--stock">
              <span>{{ item.book.stock_quantity }}</span>
            </div>
            <div class="cart__item--quantity">
              <div class="quantity-input">
                <div class="input-field">{{ item.quantity }}</div>
                <div class="button">
                  <button class="btn" @click="increaseQuantity(item.id)">
                    <el-icon>
                      <ArrowUp/>
                    </el-icon>
                  </button>
                  <button class="btn" @click="handleDecreaseQuantity(item)">
                    <el-icon>
                      <ArrowDown/>
                    </el-icon>
                  </button>
                </div>
              </div>
            </div>
            <div class="cart__item--date">
              <el-date-picker
                v-model="item.return_date_due"
                :class="{ 'error-border': errors[item.id] }"
                :disabled-date="disablePastDates"
                format="YYYY-MM-DD"
                placeholder="Chọn ngày trả"
                type="date"
                value-format="YYYY-MM-DD"
                @change="handleDateChange(item.id, item.return_date_due)"
              />
              <div v-if="errors[item.id]" class="error-message">
                {{ errors[item.id] }}
              </div>
            </div>
          </div>
        </div>
        <!--   Mobile     -->
        <div :class="{'out-of-stock': !isStockAvailable(item) }" class="cart__item--mobile">
          <router-link
            :to="'/books/' + item.book.slug"
            class="cart__item--image no-text-decoration__strong"
            @mouseleave="hideDeleteButton(item.id)"
            @mouseover="showDeleteButton(item.id)"
          >
            <div class="image-container">
              <img :src="item.book.image_url" alt="Book Image" class="cart__item--image"/>
              <!--  Delete button -->
              <div
                v-show="hoveredItemId === item.id"
                class="delete-btn"
                @click.prevent.stop="showDeleteDialog(item)"
              >
                <img alt="Delete" src="@/assets/img/User/delete-cart-item-btn.svg"/>
              </div>
            </div>
          </router-link>
          <div class="cart__item--right-container">
            <div :title="item.book.title" class="cart__item--name">{{ item.book.title }}</div>
            <div class="cart__item--stock">Số lượng trong kho: {{ item.book.stock_quantity }}</div>
            <div class="cart__item--action">
              <div class="cart__item--quantity">
                <div class="quantity-input">
                  <div class="input-field">{{ item.quantity }}</div>
                  <div class="button">
                    <button class="btn" @click="increaseQuantity(item.id)">
                      <el-icon>
                        <ArrowUp/>
                      </el-icon>
                    </button>
                    <button class="btn" @click="handleDecreaseQuantity(item)">
                      <el-icon>
                        <ArrowDown/>
                      </el-icon>
                    </button>
                  </div>
                </div>
              </div>
              <div class="cart__item--date">
                <el-date-picker
                  v-model="item.return_date_due"
                  :class="{ 'error-border': errors[item.id] }"
                  :disabled-date="disablePastDates"
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày trả"
                  type="date"
                  value-format="YYYY-MM-DD"
                  @change="handleDateChange(item.id, item.return_date_due)"
                />
              </div>
            </div>
          </div>
          <div v-if="errors[item.id]" class="error-message responsive">
            {{ errors[item.id] }}
          </div>

          <div
            v-if="cartStore.outOfStockItems.includes(item.book.id)"
            class="quantity__error-message"
          >
            Số lượng tồn kho không đủ (Còn {{ item.book.stock_quantity }} quyển)
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="cart__functions">
    <router-link class="cart__functions--btn" to="/">Tiếp tục mua hàng</router-link>
    <div class="cart__functions--btn" @click="updateCart">Cập nhật giỏ hàng</div>
  </div>

  <div class="cart__total">
    <div class="cart__total--title">Tổng cộng</div>
    <div class="cart__total--quantity">
      <p>Tổng số sản phẩm:</p>
      <p>{{ total }} quyển</p>
    </div>
    <div class="button">
      <div class="user-btn" @click="checkout">Checkout</div>
    </div>
  </div>

  <el-dialog
    v-model="isDeleteDialogVisible"
    center
    class="delete-dialog"
    title="Xác nhận xóa"
    top="20vh"
    width="30%"
  >
    <span>Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?</span>
    <template #footer>
      <el-button @click="isDeleteDialogVisible = false">Hủy</el-button>
      <el-button type="danger" @click="confirmRemoveItem">Xóa</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import {useCartStore} from "@/stores/User/cart.store";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {notifyError, notifySuccess} from "@/composables/notifications";

const router = useRouter();
const cartStore = useCartStore();
const updatedCart = ref<{ [key: number]: { quantity: number; return_date_due: string } }>({});
const total = computed(() => {
  return cartStore.cart.reduce((acc, item) => acc + item.quantity, 0);
});
const isDeleteDialogVisible = ref(false);
const itemToRemove = ref(null);
const errors = ref<{ [key: number]: string }>({});
const isStockAvailable = (item: any): boolean => {
  return item.book.stock_quantity >= item.quantity;
};

const validateCart = () => {
  let isValid = true;
  errors.value = {};

  cartStore.cart.forEach((item) => {
    if (!item.return_date_due) {
      errors.value[item.id] = "Ngày trả không được trống!";
      isValid = false;
    }
  });

  return isValid;
};

const hoveredItemId = ref<number | null>(null);
const showDeleteButton = (itemId: number) => {
  hoveredItemId.value = itemId;
};

const hideDeleteButton = () => {
  hoveredItemId.value = null;
};

const showDeleteDialog = (item: any) => {
  isDeleteDialogVisible.value = true;
  itemToRemove.value = item;
};

const disablePastDates = (time: any) => {
  return time.getTime() < Date.now() - 8.64e7;
};

onMounted(async () => {
  await cartStore.fetchCart();
  cartStore.cart.forEach((item) => {
    updatedCart.value[item.id] = item.quantity;
  });
});

const increaseQuantity = (cartItemId: number) => {
  const item = cartStore.cart.find((item) => item.id === cartItemId);
  if (item) {
    if (item.quantity >= 5) {
      notifyError("Bạn chỉ có thể mượn tối đa 5 quyển cho 1 sách!");
      return;
    }

    if (item.quantity < item.book.stock_quantity) {
      item.quantity++;
      updatedCart.value = {...updatedCart.value, [cartItemId]: item.quantity};
    } else {
      notifyError("Số lượng sách trong kho không đủ!");
    }
  }
};

const handleDecreaseQuantity = (item: any) => {
  if (item.quantity === 1) {
    isDeleteDialogVisible.value = true;
    itemToRemove.value = item;
  } else {
    item.quantity--;
  }
};

const confirmRemoveItem = async () => {
  if (itemToRemove.value) {
    await cartStore.removeCartItem(itemToRemove.value.id);
    isDeleteDialogVisible.value = false;
    notifySuccess("Sản phẩm đã được xóa khỏi giỏ hàng!");
  }
};

const handleDateChange = (cartItemId: number, newDate: string) => {
  const item = cartStore.cart.find((item) => item.id === cartItemId);
  if (item) {
    item.return_date_due = newDate;
    delete errors.value[cartItemId];
  }
};
const updateCart = async () => {
  try {
    const updates = cartStore.cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      return_date_due: item.return_date_due,
    }));

    if (!validateCart()) {
      return;
    }

    const itemsToCheck = cartStore.cart.map((item) => ({
      bookId: item.book.id,
      quantity: item.quantity,
    }));

    const isStockAvailable = await cartStore.checkStocks(itemsToCheck);

    if (!isStockAvailable) {
      await cartStore.fetchCart();
      return;
    }

    await cartStore.updateCart(updates);
    await cartStore.fetchCart();
    notifySuccess("Giỏ hàng đã được cập nhật!");
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng", error);
    notifyError("Có lỗi xảy ra khi cập nhật giỏ hàng!");
  }
};

const checkout = async () => {

  const updates = cartStore.cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    return_date_due: item.return_date_due,
  }));

  await cartStore.updateCart(updates);

  if (!validateCart()) {
    return;
  }

  const itemsToCheck = cartStore.cart.map((item) => ({
    bookId: item.book.id,
    quantity: item.quantity,
  }));

  const isStockAvailable = await cartStore.checkStocks(itemsToCheck);

  if (!isStockAvailable) {
    return;
  }

  await router.push("/checkout");
};

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style lang="scss" scoped>
.delete-btn {
  position: absolute;
  top: -20px;
  left: -20px;
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease;
  }

  &:hover {
    img {
      transform: scale(1.2);
    }
  }
}

.cart {
  width: 100%;
  @media (min-width: 1440px) {
    display: none;
  }

  &__title, &__items, &__item {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  &__title, &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    margin-top: 30px;
    box-shadow: 2px 2px 8px #efefef;

    @media (max-width: 768px) {
      padding: 10px 10px;
    }

    div {
      font-size: 1rem;
      font-weight: 400;
    }
  }

  &__empty {
    padding: 1.3rem 2rem;
    font-size: 1rem;
    font-weight: 400;
    color: #888888;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 100px;
  }

  &__item {

    &--name {
      min-width: 40%;
      display: flex;
      align-items: center;
      position: relative;

      @media (max-width: 1200px) {
        display: flex;
        flex-direction: column;
        width: 120px;
      }
    }

    &--stock {
      max-width: 200px;
      text-align: center;
    }

    &--image {
      width: 50px;
      height: 70px;
      margin-right: 30px;
      object-fit: cover;
    }

    &--quantity {
      @media (min-width: 1200.2px) {
        display: flex;
        justify-content: center;
        width: 300px;
      }

      @media (max-width: 380px) {
        gap: 10px;
        justify-content: space-between;
      }

      @media (min-width: 380.2px) and (max-width: 768px) {
        justify-content: space-between;
      }

      @media (min-width: 768.2px) and (max-width: 1200px) {
        justify-content: space-between;
      }
    }

    &--date {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;

      .error-message {
        font-size: 13px;
        margin-bottom: -23px;
      }
    }
  }

  &__functions {
    display: flex;
    justify-content: space-between;
    margin-top: 22px;

    &--btn {
      padding: 16px 20px;
      border: 1px solid #606060;
      border-radius: 5px;
      color: #000;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        background-color: var(--user-theme-color);
        color: #fff;
        border: 1px solid var(--user-theme-color);
      }
    }
  }

  &__total {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin-top: 60px;
    margin-left: 62%;
    border: 1.5px solid #000;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 70px;

    @media (max-width: 768px) {
      width: auto;
      margin-left: 0;
    }

    .button {
      display: flex;
      justify-content: center;
    }

    &--title {
      font-size: 1.15rem;
      font-weight: 500;
      padding-bottom: 10px;
      border-bottom: 1px solid #3b3b3b;
    }

    &--quantity {
      font-size: 1.05rem;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
    }

    .user-btn {
      width: 20%;
      margin-top: 30px;
    }
  }
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 1px solid #727272;
  border-radius: 5px;
  width: 70px;

  .input-field {
    width: 45px;
    text-align: center;
    border: none;
    color: var(--user-theme-color);
  }

  .button {
    display: flex;
    flex-direction: column;

    button {
      height: 20px;
      padding: 3px 0;
      border: none;
      background-color: #fff;
      cursor: pointer;
      color: var(--user-theme-color);
    }
  }
}

.quantity__error-message {
  font-size: 13px !important;
  color: red;
  padding: 10px 30px 0 10px;
  margin-top: 10px;
  width: 100%;

  @media (max-width: 1200px) {
    text-align: left;
  }
}

.cart__item.out-of-stock {
  border: 1px solid #ff4d4f;
}

:deep(.el-input) {
  .el-input__inner {
    text-align: center;
  }

  @media (max-width: 380px) {
    width: 160px;

    .el-input__inner {
      text-align: center;
    }
  }

  @media (min-width: 380.2px) and (max-width: 768px) {
    width: 200px;

    .el-input__inner {
      text-align: center;
    }
  }

  @media (min-width: 768.2px) and (max-width: 1200px) {
  }

}


.cart__item--right-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart__item--mobile {
  display: none;
  flex-wrap: wrap;
}


// Responsive for mobile
@media (max-width: 380px) {
  .cart__item--image {
    margin-right: 20px !important;
  }

  .cart__item--right-container {
    display: flex;
    flex-direction: column;
    width: 50% !important;
  }

  .cart__functions--btn {
    padding: 15px 15px;
  }
}

@media (max-width: 1200px) {
  .cart__item {
    display: none;
  }
  .cart__title {
    display: none;
  }

  .cart__item--mobile {
    display: flex;
    padding: 15px 10px;
    box-shadow: 2px 2px 8px #efefef;
    margin-top: 30px;
  }

  .cart__item--name {
    display: block;
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    max-height: 3em;
    line-height: 1.5em;
  }

  .cart__item--right-container {
    display: flex;
    flex-direction: column;
    width: 80%;
  }

  .cart__item--name {
    font-size: 16px;
    font-weight: 500;

    @media (max-width: 380px) {
      font-size: 13.5px;
    }

    @media (min-width: 380.2px) and (max-width: 768px) {
      font-size: 15px;
    }
  }

  .cart__item--stock {
    width: 100%;
    color: #6b6b6b;
    text-align: left;
    font-size: 14px;
    margin: 10px 0;

    @media (max-width: 380px) {
      font-size: 13px;
      margin: 5px 0;
    }

    @media (min-width: 380.2px) and (max-width: 768px) {
    }

    @media (min-width: 768.2px) and (max-width: 1200px) {
    }

  }

  .cart__item--image {
    width: 70px;
    height: 100px;
  }

  .cart__item--action {
    display: flex;
    width: 100%;
    justify-content: start;
    align-items: center;

    @media (max-width: 380px) {
      gap: 20px;
    }

    @media (min-width: 380.2px) and (max-width: 768px) {
      gap: 20px;
    }

    @media (min-width: 768.2px) and (max-width: 1200px) {
      gap: 20px;
    }
  }

  :deep(.el-input__wrapper) {
    height: 40px !important;
  }

  .error-message {
    margin-top: 15px;
    @media (max-width: 380px) {
      font-size: 13px;
      margin-top: 17px;
      margin-bottom: -3px;
    }

    @media (min-width: 380.2px) and (max-width: 768px) {
      margin-top: 17px;
      margin-bottom: -3px;
      font-size: 13px;
    }

    @media (max-width: 1200px) {
      text-align: left;
      margin-left: 10px;
      font-size: 13px;
    }
  }
}

:deep(.el-dialog) {
  @media (max-width: 768px) {
    width: 80% !important;
  }
}

@media (max-width: 1200px) {
  .quantity-input {
    width: 60px;
    margin-top: 10px;

    .input-field {
      width: 39px;
    }
  }
}

@media (min-width: 380.2px) and (max-width: 768px) {
}

@media (min-width: 768.2px) and (max-width: 1200px) {
}

@media (min-width: 1200.2px) and (max-width: 1500px) {

}

.cart-for-pc {
  display: none;
  width: 1170px;
  @media (min-width: 1440px) {
    display: block;
  }
}

@media (max-width: 430px) {
  .cart__item--right-container {
    width: 100px;
  }

  .cart__item--stock {
    max-width: 100%;
  }
}

@media (max-width: 380px) {
  .cart__item--date {
    margin-left: -50px;
  }
}

@media (max-width: 430px) {
  .cart__item--image {
    height: 110px;
  }

  .cart__item--stock {
    margin-bottom: 0;
  }
}

:deep(.el-input__inner::placeholder) {
  opacity: 1 !important;
  color: #a8abb2 !important;
  text-align: center;
}
</style>

<style lang="scss">
.el-dialog__header {
  padding-bottom: 20px;
}

.el-dialog__footer {
  padding-top: 20px;
}

.delete-dialog {
  width: 26.5% !important;
  @media (max-width: 768px) {
    width: 80% !important;
  }
}

.error-message {
  width: 100%;
  text-align: center;
}
</style>
