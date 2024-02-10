import { defineStore } from 'pinia'

interface User {
  id: number
}

interface UserInfo {
  id: number,
  name: string,
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User,
    userInfo: {} as UserInfo
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    }
  }
})