import { useScrollWaiter } from "~~/composables/useScrollWaiter";

class Navigator {
  path: string;

  get enable() {
    return !!this.path;
  }

  replaceQuery(query: Record<string, string | string[]>) {
    const router = useRouter();
    const to = router.resolve({ query }, router.currentRoute.value);
    router.options.history.replace(to.fullPath);
  }

  async indexProblemDetail({ id }: { id: string }) {
    await useRouter().push({
      name: "index-problems-id",
      params: { id },
    });
  }

  async indexTagDetail({ id }: { id: string }) {
    await useRouter().push({
      name: "index-problems-tags-id",
      params: { id },
    });
  }

  async gameTagDetail({ id }: { id: string }) {
    await useRouter().push({
      name: "game-menu-problems-tags-id",
      params: { id },
    });
  }

  async gameProblemDetail({ id }: { id: string }) {
    await useRouter().push({
      name: "game-menu-problems-id",
      params: { id },
    });
  }

  async gameMenu({ id }: { id: string }) {
    useProblems().setting.problemId = id;
    await useRouter().push({ name: "game-menu" });
  }

  async backOrIndex() {
    if (this.enable) {
      if (this.path.startsWith("/game")) {
        await useRouter().push({ name: "index" });
      } else {
        useRouter().back();
      }
    } else {
      await useRouter().push({ name: "index" });
    }
  }

  async backOrGameMenu() {
    if (this.enable) {
      useRouter().back();
    } else {
      await useRouter().replace({ name: "game-menu" });
    }
  }
}

export const navigator = new Navigator();

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    useRouter().afterEach((to, from) => {
      navigator.path = useRouter().options.history.state.back as string;
    });
  }

  return {
    provide: {
      navigator: readonly(navigator),
      scrollWaiter: useScrollWaiter(),
    },
  };
});
