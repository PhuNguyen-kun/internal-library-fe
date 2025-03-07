<template>
  <div>
    <TheBreadCrumb />
  </div>

  <div class="checkout">
    <div class="checkout__title">Chi tiết đơn mượn</div>
    <div class="checkout__content">
      <el-form
        label-position="top"
        require-asterisk-position="right"
        ref="userForm"
        :rules="formRules"
        :model="formData"
        class="checkout__content--user-info"
      >
        <el-form-item label="Họ và tên">
          <el-input v-model="userStore.userInfo.full_name" disabled/>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="userStore.userInfo.email" disabled/>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone_number">
          <el-input v-model="formData.phone_number"/>
        </el-form-item>
        <el-form-item label="Tỉnh" prop="province_id">
          <el-select v-model="formData.province_id" @change="handleProvinceChange" placeholder="Chọn tỉnh">
            <el-option
              v-for="province in userStore.provinces"
              :key="province.id"
              :label="province.name"
              :value="province.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Quận/Huyện" prop="district_id">
          <el-select v-model="formData.district_id" @change="handleDistrictChange" placeholder="Chọn quận/huyện">
            <el-option
              v-for="district in userStore.districts"
              :key="district.id"
              :label="district.name"
              :value="district.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Phường/Xã" prop="ward_id">
          <el-select v-model="formData.ward_id" placeholder="Chọn phường/xã">
            <el-option
              v-for="ward in userStore.wards"
              :key="ward.id"
              :label="ward.name"
              :value="ward.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="formData.address" type="textarea"/>
        </el-form-item>

        <label class="checkout__content--remember">
          <input
            type="checkbox"
            v-model="saveUserInfo"
            @change="handleSaveUserInfo"
          />
          Lưu thông tin cho lần mượn sau
        </label>
      </el-form>

      <div class="checkout__total">
        <div v-for="item in cartStore.cart" :key="item.id" class="cart__item">
          <div class="cart__item--name">
            <img :src="item.book.image_url" alt="Book Image" class="cart__item--image">
            <span>{{ item.book.title }}</span>
          </div>
          <div class="cart__item--quantity">
            <div class="quantity-input">
              <div class="input-field">{{ item.quantity }} quyển</div>
            </div>
          </div>
          <div class="cart__item--date">
            <p >Hạn trả: </p>
            <p>{{ item.return_date_due }}</p>
          </div>
        </div>

        <div class="checkout__total--quantity">
            <p>Tổng số sản phẩm:</p>
            <p>{{ total }} quyển</p>
        </div>

        <div class="checkout__total--confirm">
          <button class="user-btn" @click="handleCheckout">Xác nhận mượn sách</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
import {useUserStore} from "@/stores/User/user.store";
import {useCartStore} from "@/stores/User/cart.store";
import {computed, onMounted, ref} from "vue";
import {notifyError, notifySuccess} from "@/composables/notifications";
import router from "@/router";

const userStore = useUserStore();
const cartStore = useCartStore();
const saveUserInfo = ref(false);
const userForm = ref(null);
const formData = ref({
  full_name: userStore.userInfo.full_name,
  email: userStore.userInfo.email,
  phone_number: userStore.userInfo.phone_number,
  province_id: userStore.userInfo.province_id,
  district_id: userStore.userInfo.district_id,
  ward_id: userStore.userInfo.ward_id,
  address: userStore.userInfo.address
});

const handleSaveUserInfo = () => {
  if (saveUserInfo.value) {
    userStore.userInfo = {
      ...userStore.userInfo,
      ...formData.value
    };
    localStorage.setItem("savedUserInfo", JSON.stringify(formData.value));
  }
};
const formRules = {
  full_name: [{ required: true, message: "Họ và tên không được để trống", trigger: "blur" }],
  email: [{ required: true, message: "Email không được để trống", trigger: "blur" }],
  phone_number: [
    { required: true, message: "Số điện thoại không được để trống", trigger: "blur" },
    { pattern: /^0\d{9}$/, message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0", trigger: "blur" }
  ],
  province_id: [{ required: true, message: "Vui lòng chọn tỉnh", trigger: "change" }],
  district_id: [{ required: true, message: "Vui lòng chọn quận/huyện", trigger: "change" }],
  ward_id: [{ required: true, message: "Vui lòng chọn phường/xã", trigger: "change" }],
  address: [{ required: true, message: "Địa chỉ không được để trống", trigger: "blur" }],
};

const total = computed(() => {
  return cartStore.cart.reduce((acc, item) => acc + item.quantity, 0);
});

const handleProvinceChange = async (provinceId: number) => {
  formData.value.province_id = provinceId;
  formData.value.district_id = null;
  formData.value.ward_id = null;
  await userStore.fetchDistricts(provinceId);
};

const handleDistrictChange = async (districtId: number) => {
  formData.value.district_id = districtId;
  formData.value.ward_id = null;
  await userStore.fetchWards(districtId);
};

const handleCheckout = async () => {
  try {
    await (userForm.value as any).validate();

    const orderData = {
      ...formData.value,
      items: cartStore.cart.map(item => ({
        book_id: item.book.id,
        quantity: item.quantity,
        return_date_due: item.return_date_due,
      })),
    };

    await cartStore.checkoutCart(orderData);
    notifySuccess("Đơn mượn sách đã được tạo thành công!");
    await router.push({name: "borrowing-history"});
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  const savedInfo = localStorage.getItem("savedUserInfo");
  if (savedInfo) {
    formData.value = JSON.parse(savedInfo);
  } else {
    saveUserInfo.value = false;
  }
});

onMounted(async () => {
  await userStore.fetchUserInfo();
  await userStore.fetchProvinces();

  if (formData.value.province_id) {
    await userStore.fetchDistricts(formData.value.province_id);
  }

  if (formData.value.district_id) {
    await userStore.fetchWards(formData.value.district_id);
  }
});
</script>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  padding: 6px 10px !important;
  background-color: #F5F5F5 !important;
  box-shadow: none;
  border-radius: 2px;
  margin-bottom: 5px;
}

:deep(.el-textarea__inner) {
  background-color: #F5F5F5 !important;
  box-shadow: none;
  border-radius: 2px;
}

:deep(.el-select__wrapper) {
  width: 400px !important;
  padding: 15px 10px !important;
  background-color: #F5F5F5 !important;
  box-shadow: none;
  border-radius: 2px;
}

.checkout {
  &__title {
    margin-top: 2.5rem;
    font-size: 1.3rem;
    font-weight: 500;
  }

  &__content {
    margin-top: 40px;
    display: flex;

    &--remember {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 25px;
      color: #000;
      border-radius: 5px;
      transition: background-color 0.3s ease, color 0.3s ease;

      input {
        cursor: pointer;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid #999;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
      }

      input:checked {
        border-color: var(--user-theme-color);
        background-color: var(--user-theme-color);
      }

      input:checked::after {
        content: '✔';
        color: white;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  &__total {
    flex: 1;
    margin-left: 80px;

    &--quantity {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-left: 60px;
      border-top: 1px solid #000;
      padding: 25px 0;
    }

    &--confirm {
      margin-top: 20px;
      margin-left: 58px;
    }
  }
}

.cart__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-left: 60px;

    &--name {
      width: 370px;
      display: flex;
      align-items: center;
    }

    &--stock {
      width: 100px;
      text-align: center;
    }

    &--image {
      width: 50px;
      height: 70px;
      margin-right: 20px;
    }

    &--quantity {
      width: 100px;
    }

    &--date {
      display: flex;
      gap: 10px;
    }
}
</style>
