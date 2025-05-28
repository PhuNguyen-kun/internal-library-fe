import { onMounted } from 'vue';

const $ = (selector: string): HTMLElement | null => document.querySelector(selector);
const $$ = (selector: string): NodeListOf<HTMLElement> => document.querySelectorAll(selector);

export const useToggle = () => {
  const initJsToggle = (): void => {
    const toggleButtons = $$('.js-toggle');

    toggleButtons.forEach((button: HTMLElement) => {
      const target = button.getAttribute('toggle-target');

      if (!target) {
        console.error(`Cần thêm toggle-target cho: ${button.outerHTML}`);
        return;
      }

      button.onclick = (): void => {
        const targetElement = $(target);

        if (!targetElement) {
          console.error(`Không tìm thấy phần tử "${target}"`);
          return;
        }

        const isHidden = targetElement.classList.contains('hide');

        requestAnimationFrame(() => {
          targetElement.classList.toggle('hide', !isHidden);
          targetElement.classList.toggle('show', isHidden);
        });
      };
    });
  };

  onMounted(() => {
    initJsToggle();
  });
};
