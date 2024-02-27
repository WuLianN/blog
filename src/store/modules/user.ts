import { defineStore } from 'pinia'

interface User {
  id: number
}

interface UserInfo {
  id: number,
  user_name: string,
  avatar: string
}

interface UserSetting {
  primary_color: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User,
    userInfo: {} as UserInfo,
    userSetting: {} as UserSetting,
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setUserSetting(userSetting: UserSetting) {
      this.userSetting = userSetting
    },
  }
})