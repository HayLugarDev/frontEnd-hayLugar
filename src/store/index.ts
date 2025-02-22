import { defineStore } from 'pinia';

interface State {
  user: string | null;
}

export const useMainStore = defineStore('main', {
  state: (): State => ({
    user: null,
  }),
  actions: {
    setUser(user: string) {
      this.user = user;
    },
  },
});
