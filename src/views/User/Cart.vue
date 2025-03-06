<template>
  <div>
    <TheBreadCrumb/>
  </div>

  <div class="cart">
    <div class="cart__title">
      <div class="cart__item--name">Tên sách</div>
      <div class="cart__item--stock">SL trong kho</div>
      <div class="cart__item--quantity">Số lượng mượn</div>
      <div class="cart__item--date">Ngày trả</div>
    </div>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">Giỏ hàng trống</div>
    <div class="cart__items">
      <div v-for="item in cartStore.cart" :key="item.id">
        <div class="cart__item" :class="{'out-of-stock': !isStockAvailable(item) }">
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
            <span>{{ item.book.title }}</span>
          </router-link>
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
        <div
          v-if="cartStore.outOfStockItems.includes(item.book.id)"
          class="quantity__error-message"
        >
          Số lượng tồn kho không đủ (Còn {{ item.book.stock_quantity }} quyển)
        </div>
      </div>
    </div>
  </div>

  <div class="cart__functions">
    <router-link class="cart__functions--btn" to="/homepage">Tiếp tục mua hàng</router-link>
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
      notifyError("Vui lòng chọn ngày trả sách!");
      return;
    }

    const itemsToCheck = cartStore.cart.map((item) => ({
      bookId: item.book.id,
      quantity: item.quantity,
    }));

    const isStockAvailable = await cartStore.checkStocks(itemsToCheck);

    if (!isStockAvailable) {
      notifyError("Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng kiểm tra lại!");
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
  await cartStore.fetchCart();
  if (!validateCart()) {
    notifyError("Vui lòng chọn ngày trả sách!");
    return;
  }

  const itemsToCheck = cartStore.cart.map((item) => ({
    bookId: item.book.id,
    quantity: item.quantity,
  }));

  const isStockAvailable = await cartStore.checkStocks(itemsToCheck);

  if (!isStockAvailable) {
    notifyError("Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng kiểm tra lại!");
    return;
  }

  await updateCart();
  router.push("/checkout");
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

  &__title, &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    margin-top: 30px;
    box-shadow: 2px 2px 8px #efefef;

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
  }

  &__item {

    &--name {
      width: 400px;
      display: flex;
      align-items: center;
      position: relative;
    }

    &--stock {
      width: 100px;
      text-align: center;
    }

    &--image {
      width: 50px;
      height: 70px;
      margin-right: 30px;
    }

    &--quantity {
      display: flex;
      justify-content: center;
      width: 150px;
    }

    &--date {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;

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
  font-size: 14px;
  color: red;
  padding: 10px 30px 0 30px;
}

.cart__item.out-of-stock {
  border: 1px solid #ff4d4f;
}
</style>
