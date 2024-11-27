<template>
  <div>This is demo component page</div>
  <Button class="btn--primary" @click="openModal">Click</Button>

  <Modal
      :visible="isModalVisible"
      :title="'Form Modal'"
      @submit="handleFormSubmit"
      @update:visible="isModalVisible = $event"
      @reset="resetForm"
  >
    <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        require-asterisk-position="right"
        label-position="top"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="Age" prop="age">
        <el-input-number v-model="formData.age" />
      </el-form-item>
    </el-form>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/Admin/Common/Modal.vue';
import Button from "@/components/Admin/Common/Button.vue";

const isModalVisible = ref(false);

const formData = ref({
  name: '',
  age: null,
});

const formRef = ref(null);

const formRules = ref({
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  age: [{ required: true, message: 'Age is required', trigger: 'blur' }],
});

const handleFormSubmit = () => {
  console.log('Form submitted with data:', formData.value);
  isModalVisible.value = false;
};

const openModal = () => {
  isModalVisible.value = true;
};

const resetForm = () => {
  formData.value = {
    name: '',
    age: null,
  };
  formRef.value?.resetFields();
  console.log('Form reset');
};

</script>

<style scoped>
.btn--primary {
  background-color: #409eff;
  color: #fff;
  border: none;
}
</style>
