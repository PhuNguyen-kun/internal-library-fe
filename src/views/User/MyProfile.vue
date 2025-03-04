<template>
  <div class="my-profile">
    <h1 class="title">Chỉnh sửa hồ sơ của bạn</h1>
    <el-form
      label-position="top"
      require-asterisk-position="right"
      ref="userForm"
      :rules="formRules"
    class="checkout__content--user-info"
    >
      <el-form-item label="Họ và tên">
        <el-input v-model="userStore.userInfo.full_name"/>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="userStore.userInfo.email"/>
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone_number">
        <el-input v-model="userStore.userInfo.phone_number"/>
      </el-form-item>
      <el-form-item label="Tỉnh" prop="province">
        <el-select v-model="userStore.userInfo.province_id" @change="handleProvinceChange" placeholder="Chọn tỉnh">
          <el-option
            v-for="province in userStore.provinces"
            :key="province.id"
            :label="province.name"
            :value="province.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Quận/Huyện" prop="district">
        <el-select v-model="userStore.userInfo.district_id" @change="handleDistrictChange" placeholder="Chọn quận/huyện">
          <el-option
            v-for="district in userStore.districts"
            :key="district.id"
            :label="district.name"
            :value="district.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Phường/Xã" prop="ward">
        <el-select v-model="userStore.userInfo.ward_id" placeholder="Chọn phường/xã">
          <el-option
            v-for="ward in userStore.wards"
            :key="ward.id"
            :label="ward.name"
            :value="ward.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="address">
        <el-input v-model="userStore.userInfo.address" type="textarea"/>
      </el-form-item>

      <div class="button-container">
        <div @click="cancelChanges" class="cancel">Cancel</div>
        <div class="user-btn" @click="updateUser">Lưu thay đổi</div>
      </div>
    </el-form>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {useUserStore} from "@/stores/User/user.store";

const userStore = useUserStore();

const handleProvinceChange = async (provinceId: number) => {
  userStore.userInfo.province = provinceId;
  userStore.userInfo.district_id = null;
  userStore.userInfo.ward_id = null;
  await userStore.fetchDistricts(provinceId);
};

const handleDistrictChange = async (districtId: number) => {
  userStore.userInfo.district = districtId;
  userStore.userInfo.ward_id = null;
  await userStore.fetchWards(districtId);
};

const updateUser = async () => {
  await userStore.updateUserInfo();
};

const cancelChanges = () => {
  userStore.fetchUserInfo();
};

onMounted(async () => {
  await userStore.fetchUserInfo();
  await userStore.fetchProvinces();

  if (userStore.userInfo.province_id) {
    await userStore.fetchDistricts(userStore.userInfo.province_id);
  }

  if (userStore.userInfo.district_id) {
    await userStore.fetchWards(userStore.userInfo.district_id);
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
  width: 300px !important;
  padding: 15px 10px !important;
  background-color: #F5F5F5 !important;
  box-shadow: none;
  border-radius: 2px;
}

.my-profile {
  padding: 40px 60px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.title {
  color: var(--user-theme-color);
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 30px;
  .cancel {
    &:hover {
      cursor: pointer;
      color: var(--user-theme-color);
    }
  }
}
</style>
