<template>
  <button
    :class="['btn', `btn--${type}`, `btn--${size}`, { 'btn--disabled': disabled, 'btn--round': round }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon"></slot>
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
import {PropType} from "vue"
type ButtonType = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'large' | 'medium' | 'small';

defineProps({
  type: {
    type: String as ButtonType,
    default: 'primary',
  },
  size: {
    type: String as ButtonSize,
    default: 'medium',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);
const handleClick = (event) => {
    emit('click', event);
};
</script>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 300ms;

  &--primary {

  }

  &--secondary {

  }
}

.btn:hover {
  opacity: 0.9;
}

.btn--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--disabled:hover {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn--round {
  border-radius: 99px;
}
/* Type */
.btn--primary {
  background-color: var(--admin-theme-color);
  color: white;
}

.btn--secondary {
  background-color: #fff;
  color: #000;
  border: 1px solid #979797;
}

.btn--danger {
  background-color: #e74c3c;
  color: white;
}

.btn--success {
  background-color: #2ecc71;
  color: white;
}

/* Size */
.btn--small {
  font-size: 13px;
  padding: 4px 8px;
  width: 100px;
}

.btn--medium {
  font-size: 16px;
  padding: 8px 16px;
  width: 150px;
}

.btn--large {
  font-size: 19px;
  padding: 12px 24px;
}
</style>
