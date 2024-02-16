import { defineStore } from 'pinia'

interface HomeState {
  status: boolean
  recommendList: Array<any>
  keyword: string
}

export const useHomeStore = defineStore({
  id: 'home',
  state: (): HomeState => ({
    status: false,
    recommendList: [],
    keyword: ''
  }),
  actions: {
    setLoginCardStatus(status: boolean) {
      this.status = status
    },
    setRecommendList(list: any) {
      this.recommendList = list
    },
    setKeyword(keyword: string) {
      this.keyword = keyword
    }
  },
});