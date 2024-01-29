import { defineStore } from 'pinia'

interface HomeState {
  status: boolean;
}

export const useHomeStore = defineStore({
  id: 'app-user-card',
  state: (): HomeState => ({
    status: false,
  }),
  actions: {
    setLoginCardStatus(status: boolean) {
      this.status = status
    },
  },
});