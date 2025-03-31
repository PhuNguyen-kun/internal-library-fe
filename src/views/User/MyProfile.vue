<template>
  <div class="my-profile">
    <h1 class="title">Chỉnh sửa hồ sơ của bạn</h1>
    <el-form
      label-position="top"
      require-asterisk-position="right"
      ref="userForm"
      :rules="formRules"
      :model="formData"
      class="checkout__content--user-info no-responsive"
    >
      <el-form-item label="Họ và tên">
        <el-input v-model="formData.full_name"/>
      </el-form-item>

      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="Email">
            <el-input v-model="userStore.userInfo.email" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Số điện thoại" prop="phone_number">
            <el-input v-model="formData.phone_number"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="12">
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
        </el-col>

        <el-col :span="12">
          <el-form-item label="Giới tính" prop="gender">
            <el-select v-model="formData.gender" placeholder="Chọn giới tính">
              <el-option label="Nam" :value="0"></el-option>
              <el-option label="Nữ" :value="1"></el-option>
              <el-option label="Khác" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Địa chỉ" prop="address">
            <el-input v-model="formData.address" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="button-container">
        <div @click="cancelChanges" class="cancel">Hủy thay đổi</div>
        <div class="user-btn" @click="updateUser">Lưu thay đổi</div>
      </div>
    </el-form>

    <el-form
      label-position="top"
      require-asterisk-position="right"
      ref="userForm"
      :rules="formRules"
      :model="formData"
      class="checkout__content--user-info responsive"
    >
      <el-form-item label="Họ và tên">
        <el-input v-model="userStore.userInfo.full_name"/>
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
      <el-form-item label="Giới tính" prop="gender">
        <el-select v-model="formData.gender" placeholder="Chọn giới tính">
          <el-option label="Nam" :value="0"></el-option>
          <el-option label="Nữ" :value="1"></el-option>
          <el-option label="Khác" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="address">
        <el-input v-model="formData.address" type="textarea"/>
      </el-form-item>

      <div class="button-container">
        <div @click="cancelChanges" class="cancel">Hủy thay đổi</div>
        <div class="user-btn" @click="updateUser">Lưu thay đổi</div>
      </div>
    </el-form>

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/User/user.store";

const userStore = useUserStore();
const userForm = ref(null);

const formData = ref({
  full_name: userStore.userInfo.full_name,
  email: userStore.userInfo.email,
  phone_number: userStore.userInfo.phone_number,
  gender: userStore.userInfo.gender,
  province_id: userStore.userInfo.province_id,
  district_id: userStore.userInfo.district_id,
  ward_id: userStore.userInfo.ward_id,
  address: userStore.userInfo.address
});

const formRules = {
  full_name: [{ required: true, message: "Họ và tên không được để trống", trigger: "blur" }],
  email: [{ required: true, message: "Email không được để trống", trigger: "blur" }],
  gender: [{ required: true, message: "Vui lòng chọn giới tính", trigger: "change" }],
  phone_number: [
    { required: true, message: "Số điện thoại không được để trống", trigger: "blur" },
    { pattern: /^0\d{9}$/, message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0", trigger: "blur" }
  ],
  province_id: [{ required: true, message: "Vui lòng chọn tỉnh", trigger: "change" }],
  district_id: [{ required: true, message: "Vui lòng chọn quận/huyện", trigger: "change" }],
  ward_id: [{ required: true, message: "Vui lòng chọn phường/xã", trigger: "change" }],
  address: [{ required: true, message: "Địa chỉ không được để trống", trigger: "blur" }],
};

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

const mapGenderToValue = (gender: string): number | null => {
  switch (gender) {
    case "Nam":
      return 0;
    case "Nữ":
      return 1;
    case "Khác":
      return 2;
    default:
      return null;
  }
};

const updateUser = async () => {
  try {
    await (userForm.value as any).validate();

    const payload = {
      ...formData.value,
      gender: formData.value.gender
    };

    console.log("payload", payload);

    await userStore.updateUserInfo(payload);
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
  }
};
const cancelChanges = () => {
  formData.value = {
    full_name: userStore.userInfo.full_name,
    email: userStore.userInfo.email,
    gender: userStore.userInfo.gender,
    phone_number: userStore.userInfo.phone_number,
    province_id: userStore.userInfo.province_id,
    district_id: userStore.userInfo.district_id,
    ward_id: userStore.userInfo.ward_id,
    address: userStore.userInfo.address
  };
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

  formData.value = {
    full_name: userStore.userInfo.full_name,
    email: userStore.userInfo.email,
    phone_number: userStore.userInfo.phone_number,
    gender: mapGenderToValue(userStore.userInfo.gender),
    province_id: userStore.userInfo.province_id,
    district_id: userStore.userInfo.district_id,
    ward_id: userStore.userInfo.ward_id,
    address: userStore.userInfo.address
  };
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06);
  @media (max-width: 767px) {
    padding: 10px 10px;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    padding: 40px 40px;
  }
}
.title {
  color: var(--user-theme-color);
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    display: none;
  }
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 30px;
  margin-top: 10px;

  @media (max-width: 767px) {
    flex-direction: column;
    margin-top: 20px;
    gap: 20px;
    margin-bottom: 10px;

    .cancel {
      order: 1;
    }
  }
  .cancel {
    font-size: 14px;
    &:hover {
      cursor: pointer;
      color: var(--user-theme-color);
    }
  }
}

:deep(.el-select__wrapper) {
  width: 100% !important;
}

:deep(.el-textarea__inner) {
  height: 137px !important;
}

@media (max-width: 380px) {
  :deep(.el-textarea__inner) {
    height: 100px !important;
  }
}

.no-responsive {
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
