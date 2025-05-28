<template>
  <article class="card">
    <figure>
      <span class="card__icon">
        <component :is="card?.icon" />
      </span>
    </figure>
    <div class="card__content">
      <h3 class="card__content--total">
        {{ card?.total }}
      </h3>
      <p>{{ card?.title }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps({
  card: Object
})
</script>

<style scoped lang="scss">
.card {
  text-align: center;
  transition: all linear 0.35s;
  border-radius: 0.25rem;
  cursor: pointer;
  flex: 1;

  figure {
    text-align: center;
    border: 0.75rem solid rgba(47, 46, 48, 0.3);
    border-radius: 50%;
    width: fit-content;
    margin: 0 auto;
    transition: all linear 0.35s;

    .card__icon {
      font-size: 1rem;
      height: 4rem;
      width: 4rem;
      background-color: var(--user-theme-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 50%;
      margin: 0 auto;
      position: relative;
      svg {
        width: 2.5rem;
        height: auto;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  &__content {
    text-align: center;
    margin-top: 1.5rem;

    h3 {
      font-size: 2rem;
      font-style: normal;
      font-weight: 700;
      line-height: 1.875rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    p {
      color: #000;
      margin-top: 0.75rem;
      text-align: center;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5rem;
      text-transform: capitalize;
    }
  }
}
</style>
