<template>
  <div class="container">
    <h1 class="title">Thay đổi mật khẩu</h1>
    <el-form
      ref="passwordForm"
      :model="passwordData"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
      class="checkout__content--user-info"
    >
      <el-form-item label="Mật khẩu cũ" prop="old_password">
        <el-input type="password" v-model="passwordData.old_password" show-password @input="clearOldPasswordError"/>
        <p v-if="errorMessages.old_password" class="error-message">{{ errorMessages.old_password }}</p>
      </el-form-item>

      <el-form-item label="Mật khẩu mới" prop="new_password">
        <el-input
          type="password"
          v-model="passwordData.new_password"
          show-password
          @input="validateNewPasswordConfirmation"
        />
      </el-form-item>
      <el-form-item label="Nhập lại mật khẩu mới" prop="new_password_confirmation">
        <el-input type="password" v-model="passwordData.new_password_confirmation" show-password />
      </el-form-item>
    </el-form>

    <div class="button-container">
      <div class="user-btn" @click="handleChangePassword">Lưu thay đổi</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/User/user.store";
import { notifySuccess, notifyError } from "@/composables/notifications";
import router from "@/router";

const userStore = useUserStore();
const passwordForm = ref();
const errorMessages = ref({ old_password: "" });

const passwordData = ref({
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const formRules = {
  old_password: [{ required: true, message: "Vui lòng nhập mật khẩu cũ", trigger: "blur" }],
  new_password: [
    { required: true, message: "Vui lòng nhập mật khẩu mới", trigger: "blur" },
    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự", trigger: "blur" },
  ],
  new_password_confirmation: [
    { required: true, message: "Vui lòng nhập lại mật khẩu mới", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordData.value.new_password) {
          callback(new Error("Mật khẩu nhập lại không khớp"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const validateNewPasswordConfirmation = () => {
  if (passwordData.value.new_password_confirmation) {
    passwordForm.value.validateField('new_password_confirmation');
  }
};

const clearOldPasswordError = () => {
  errorMessages.value.old_password = "";
};


const handleChangePassword = async () => {
  await passwordForm.value.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      await userStore.updatePassword(passwordData.value);
      notifySuccess("Đổi mật khẩu thành công!");

      passwordData.value.old_password = "";
      passwordData.value.new_password = "";
      passwordData.value.new_password_confirmation = "";
      errorMessages.value.old_password = "";

      localStorage.removeItem("user_access_token");
      await router.push('/login');
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        if (error.response.data.errors.old_password) {
          errorMessages.value.old_password = error.response.data.errors.old_password[0];
        }
        console.log(error.response.data.errors);
      } else {
        notifyError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  });
};
</script>


<style scoped lang="scss">
.error-message {
  color: red;
  font-size: 14px;
}

.container {
  padding: 40px 60px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
}

.title {
  color: var(--user-theme-color);
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    display: none;
  }
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

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
</style>
