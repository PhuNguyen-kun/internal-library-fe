<template>
  <div
    class="flying-heart"
    :style="{
      left: startX + 'px',
      top: startY + 'px',
    }"
  >
    ❤️
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
  startX: Number,
  startY: Number,
  endX: Number,
  endY: Number
});

onMounted(() => {
  const heart = document.querySelector('.flying-heart');
  if (heart) {
    heart.style.transform = `translate(${props.endX - props.startX}px, ${props.endY - props.startY}px)`;
    heart.style.opacity = '0';

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
});
</script>

<style lang="scss">
.flying-heart {
  position: fixed;
  z-index: 9999;
  font-size: 24px;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  transform-origin: center;
  will-change: transform, opacity;
}</style>
