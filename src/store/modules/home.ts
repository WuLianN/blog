import { defineStore } from 'pinia'

interface HomeState {
  status: boolean
  recommendList: Array<any>
  keyword: string
  menuList: Array<any>
}

export const useHomeStore = defineStore({
  id: 'home',
  state: (): HomeState => ({
    status: false,
    recommendList: [],
    keyword: '',
    menuList: [],
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
    },
    setMenuList(list: any) {
      this.menuList = list
    },
  },
})
