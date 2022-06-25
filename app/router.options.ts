import { RouterConfig } from "@nuxt/schema";
import { useScrollWaiter } from "~~/composables/useScrollWaiter";

export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    if (to?.name === from?.name && to?.params !== from?.params) {
      useScrollWaiter().flush();
    }

    const noScroll = await useScrollWaiter().wait();

    if (noScroll) {
      return false;
    }

    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  },
};
