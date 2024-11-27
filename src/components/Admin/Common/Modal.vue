<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    @close="handleClose"
    @update:model-value="updateVisible"
  >
    <slot></slot>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">{{ confirmText }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  confirmText: {
    type: String,
    default: "Submit",
  },
});

const emit = defineEmits(["update:visible", "submit", "reset"]);

const handleClose = () => {
  emit("update:visible", false);
  emit("reset");
};

const handleCancel = () => {
  emit("update:visible", false);
  emit("reset");
};

const handleSubmit = () => {
  emit("submit");
  emit("update:visible", false);
  emit("reset");
};
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss">
.el-dialog__header {
  text-align: center;
  font-weight: 600;
  padding: 5px 0 20px 0;
}
</style>
