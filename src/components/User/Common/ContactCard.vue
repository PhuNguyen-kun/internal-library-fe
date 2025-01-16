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
  padding: 2.19rem;
  text-align: center;
  transition: all linear 0.35s;
  border-radius: 0.25rem;
  border: 1px solid #ddd;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  &:hover {
    border-radius: 0.25rem;
    background: var(--user-theme-color);
    box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.2);
    color: #fff;
    figure {
      border-color: rgba(255, 255, 255, 0.3);
      .card__icon {
        background-color: #fff;
        color: var(--user-theme-color);
      }
    }
    .card__content {
      color: #fff;

      p {
        color: #fff;
      }
    }
  }
}

@media screen and (max-width: 48rem) {
  .card {
    flex: 1;
  }
}
</style>
