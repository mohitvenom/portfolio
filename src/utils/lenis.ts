import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  lenisInstance = lenis;
};

export const scrollTo = (target: string | HTMLElement | number, options?: any) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  }
};

export const start = () => {
  if (lenisInstance) {
    lenisInstance.start();
  }
};

export const stop = () => {
  if (lenisInstance) {
    lenisInstance.stop();
  }
};
