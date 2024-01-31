import { defineStore } from 'pinia'

interface HomeState {
  status: boolean;
  recommendList: Array<any>
}

export const useHomeStore = defineStore({
  id: 'home',
  state: (): HomeState => ({
    status: false,
    recommendList: []
  }),
  actions: {
    setLoginCardStatus(status: boolean) {
      this.status = status
    },
    setRecommendList(list: any) {
      this.recommendList = list
    },
  },
});