<template>
  <div class="container">
    <div class="page-wrapper">
      <div class="section">
        <TheBreadCrumb />
      </div>
      <div class="content">
        <div class="content__intro section-left">
          <div class="content__intro--text">
            <h2 class="content__intro--title">Our Story</h2>
            <p>
              Launced in 2015, 2handMarket is South Asia's premier online shopping makterplace with
              an active presense in Bangladesh. Supported by wide range of tailored marketing, data
              and service solutions, 2handMarket has 10,500 sallers and 300 brands and serves 3
              millioons customers across the region.
            </p>
            <p>
              2handMarket has more than 1 Million products to offer, growing at a very fast.
              2handMarket offers a diverse assotment in categories ranging from consumer.
            </p>
          </div>
          <img src="@/assets/img/User/contact-layout.png" alt="about-bg" />
        </div>
        <div class="contact-cards section">
          <ContactCard v-for="(card, index) of cards" :key="index" :card="card"></ContactCard>
        </div>
        <div class="section">
          <ServiceBar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactCard from '@/components/User/Common/ContactCard.vue'
import IconBag from '@/components/User/Icons/IconBog.vue'
import IconBagMoney from '@/components/User/Icons/IconBagMoney.vue'
import IconMoney from '@/components/User/Icons/IconMoney.vue'
import IconStore from '@/components/User/Icons/IconStore.vue'
import ServiceBar from '@/components/User/Common/ServiceBar.vue'
import TheBreadCrumb from '@/components/User/Common/TheBreadCrumb.vue'

const cards = [
  {
    icon: IconStore,
    total: '10.5K',
    title: 'Sellers active our site'
  },
  {
    icon: IconMoney,
    total: '33K',
    title: 'Monthly Product Sale'
  },
  {
    icon: IconBag,
    total: '45.5k',
    title: 'Customer active in our site'
  },
  {
    icon: IconBagMoney,
    total: '25K',
    title: 'Annual gross sale in our site'
  }
]
</script>

<style lang="scss" scoped>
.content {
  margin-top: 2.63rem;

  &__intro {
    display: flex;
    align-items: center;
    column-gap: 4.69rem;

    &--text {
      flex: 1;
    }

    &--title {
      font-size: 3.375rem;
      font-style: normal;
      font-weight: 600;
      line-height: 4rem;
      /* 118.519% */
      letter-spacing: 0.2025rem;
      margin-bottom: 2.5rem;
    }

    p {
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.625rem;
      margin: 1.5rem 0;
    }
  }

  .contact-cards {
    margin: 8.75rem 0;
    display: flex;
    justify-content: space-between;
    column-gap: 1.88rem;
  }
}

@media screen and (max-width: 1200px) {
  .content__intro {
    flex-wrap: wrap;
  }
  .contact-cards {
    flex-wrap: wrap;
    row-gap: 1.88rem;
    flex: 1;
  }
  img {
    width: 100%;
  }
}

@media screen and (min-width: 48.1rem) and (max-width: 75rem) {
  .content__intro {
    flex-wrap: wrap;
  }
  .contact-cards {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.88rem;
  }
}
</style>
