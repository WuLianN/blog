import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  user_name: string
  avatar: string
  is_privacy: number
}

interface UserSetting {
  primary_color: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
    userSetting: {} as UserSetting,
  }),
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setUserSetting(userSetting: UserSetting) {
      this.userSetting = userSetting
    },
    logout() {
      this.userInfo = {
        id: 0,
        user_name: '',
        avatar: '',
        is_privacy: 0,
      }
    },
  },
})
