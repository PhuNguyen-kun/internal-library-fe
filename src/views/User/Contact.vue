<template>
  <div class="container">
    <TheBreadCrumb style="padding-bottom: 80px" />
    <div class="section">
      <div class="page-wrapper">
        <div class="contact-section">
          <div class="contact-info">
            <div class="contact-info__item">
              <h2 class="contact-info__item--title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <rect width="40" height="40" rx="20" fill="#FF4500" fill-opacity="0.780392" />
                  <path
                    d="M18.5542 14.24L15.1712 10.335C14.7812 9.885 14.0662 9.887 13.6132 10.341L10.8312 13.128C10.0032 13.957 9.76623 15.188 10.2452 16.175C13.1069 22.1 17.8853 26.8851 23.8062 29.755C24.7922 30.234 26.0222 29.997 26.8502 29.168L29.6582 26.355C30.1132 25.9 30.1142 25.181 29.6602 24.791L25.7402 21.426C25.3302 21.074 24.6932 21.12 24.2822 21.532L22.9182 22.898C22.8484 22.9712 22.7565 23.0194 22.6566 23.0353C22.5567 23.0512 22.4543 23.0339 22.3652 22.986C20.1357 21.7021 18.2862 19.8502 17.0052 17.619C16.9573 17.5298 16.9399 17.4272 16.9558 17.3272C16.9717 17.2271 17.02 17.135 17.0932 17.065L18.4532 15.704C18.8652 15.29 18.9102 14.65 18.5542 14.239V14.24Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Call To Us</span>
              </h2>
              <div class="contact-info__item--content">
                <p>We are available 24/7, 7 days a week.</p>
                <p>Phone: <a href="tel:+8801611112222">+8801611112222</a></p>
              </div>
            </div>
            <div class="contact-info__line"></div>
            <div class="contact-info__item">
              <h2 class="contact-info__item--title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <rect width="40" height="40" rx="20" fill="#FF4500" fill-opacity="0.780392" />
                  <path
                    d="M10 13L20 20L30 13M10 27H30V13H10V27Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Write To Us</span>
              </h2>
              <div class="contact-info__item--content">
                <p>Fill out our form and we will contact you within 24 hours.</p>
                <p>
                  Emails:
                  <a href="mailto:customer@2handMarket.com">customer@2handMarket.com</a>
                </p>
                <p>Emails: <a href="mailto:support@2handMarket.com">support@2handMarket.com</a></p>
              </div>
            </div>
          </div>
          <form class="contact-form">
            <div class="contact-form__top">
              <input type="text" name="" id="" placeholder="Your Name" />
              <input type="email" name="" id="" placeholder="Your Email" />
              <input type="text" name="" id="" placeholder="Your Phone" />
            </div>
            <textarea name="" id="" placeholder="Your Message"></textarea>
            <div class="form-btn">
              <button type="submit">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheBreadCrumb from "@/components/User/Common/TheBreadCrumb.vue";
</script>

<style scoped lang="scss">
.contact-section {
  display: grid;
  column-gap: 1.88rem;
  grid-template-columns: 1fr 2fr;
  padding-bottom: 3.75rem;
  & > div,
  form {
    border-radius: 0.25rem;
    background: var(--white-coor);
    box-shadow: 0px 1px 13px 0px rgba(0, 0, 0, 0.05);
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    padding: 2.5rem 2.19rem;

    &__item {
      &--title {
        display: flex;
        align-items: center;
        font-style: normal;
        font-weight: 500;
        line-height: 1.5;
        column-gap: 0.75rem;
      }

      &--content {
        margin-top: 1.5rem;

        p {
          display: flex;
          align-items: center;
          margin: 1rem 0;
          column-gap: 0.25rem;
          font-size: 0.875rem;

          a {
            color: var(--black-color);
            text-decoration: none;
          }
        }
      }
    }

    &__line {
      height: 0.0625rem;
      width: 100%;
      background-color: var(--black-color);
      margin: 2rem 0;
    }
  }

  .contact-form {
    padding: 2.5rem 2rem;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5;

    &__top {
      display: flex;
      column-gap: 1rem;

      input {
        width: 14.6875rem;
        height: 3.125rem;
        display: block;
        outline: none;
        border-radius: 0.25rem;
        background: #f5f5f5;
        border: none;
        padding: 0 0.75rem;
            font-size: 1rem;
      }
    }

    textarea {
      width: 100%;
      height: 12.9375rem;
      display: block;
      border-radius: 0.25rem;
      background: #f5f5f5;
      border: none;
      outline: none;
      padding: 0.75rem;
        font-size: 1rem;
      margin: 2rem 0;
    }

    .form-btn {
      display: flex;
      justify-content: flex-end;

      button {
        background: var(--primary-color);
        color: white;
        padding: 1rem 3rem;
        border: none;
        outline: none;
        display: block;
        border-radius: 0.25rem;
      }
    }
  }
}

@media screen and (max-width: 48rem) {
  .contact-section {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .contact-form {
    &__top {
      flex-wrap: wrap;
      row-gap: 1rem;
      input {
        width: 100% !important;
      }
    }
  }
}

@media screen and (min-width: 48.1rem) and (max-width: 75rem) {
  .contact-section {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .contact-form {
    &__top {
      flex-wrap: wrap;
      row-gap: 1rem;
      input {
        width: 100% !important;
      }
    }
  }
}
</style>
