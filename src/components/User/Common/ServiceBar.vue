<template>
  <div class="service-bar">
    <ServiceCard v-for="(card, index) of cards" :key="index" :card="card" />
  </div>
</template>

<script setup lang="ts">
import IconSecurity from '@/components/User/Icons/IconSecurity.vue'
import IconDelivery from '@/components/User/Icons/IconDelivery.vue'
import ServiceCard from '@/components/User/Common/ServiceCard.vue'
import { Headset } from '@element-plus/icons-vue'

const cards = [
  {
    icon: IconDelivery,
    total: '10.5K',
    title: 'Sellers active our site'
  },
  {
    icon: Headset,
    total: '10.5K',
    title: 'Sellers active our site'
  },
  {
    icon: IconSecurity,
    total: '10.5K',
    title: 'Sellers active our site'
  }
]
</script>

<style scoped lang="scss">
.service-bar {
  display: flex;
  column-gap: 5.5rem;
  padding: 0 7rem;
  margin-top: 9.5rem;
  margin-bottom: 4rem;
}

@media screen and (max-width: 75rem) {
  .service-bar {
    padding: 0;
    flex-wrap: wrap;
    column-gap: 2rem;
  }
}
</style>
