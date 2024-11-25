<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="600px"
    @close="handleClose"
    @update:model-value="updateVisible"
  >
    <el-form
      :model="formData"
      :rules="formRules"
      ref="formRef"
      label-width="120px"
    >
      <el-form-item
        v-for="(field, index) in formConfig"
        :key="index"
        :label="field.label"
        :prop="field.prop"
      >
        <template v-if="field.type === 'text'">
          <el-input v-model="formData[field.prop]" />
        </template>
        <template v-else-if="field.type === 'number'">
          <el-input-number v-model="formData[field.prop]" />
        </template>
        <template v-else-if="field.type === 'select'">
          <el-select v-model="formData[field.prop]" placeholder="Select">
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

// Định nghĩa các props
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  formData: {
    type: Object,
    required: true,
  },
  formConfig: {
    type: Array,
    required: true,
  },
  formRules: {
    type: Object,
    default: () => ({}),
  },
});

// Định nghĩa các sự kiện emit
const emit = defineEmits(["update:visible", "submit"]);

const formRef = ref();

// Xử lý khi modal đóng
const handleClose = () => {
  emit("update:visible", false); // Phát sự kiện update:visible
};

// Xử lý khi nhấn nút Cancel
const handleCancel = () => {
  emit("update:visible", false); // Đóng modal
};

// Xử lý khi nhấn nút Submit
const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit("submit", formData); // Phát sự kiện submit kèm dữ liệu
      emit("update:visible", false); // Đóng modal
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
