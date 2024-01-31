import { defineStore } from 'pinia'

interface User {
  id: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    }
  }
})