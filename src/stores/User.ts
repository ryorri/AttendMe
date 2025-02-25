import { defineStore } from 'pinia'

export const useUserStore = defineStore('auth', {
  state: () => ({
    userId: null as number | null,
    name: null as string | null,
    surname: null as string | null,
    isTeacher: null as boolean | null,
    isStudent: null as boolean | null,
    token: null as string | null,
    tokenExpiration: null as number | null,
    logoutTimer: null as ReturnType<typeof setTimeout> | null,
  }),

  actions: {
    initializeStore() {
      const storedUserData = sessionStorage.getItem('userData')
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData)
        this.userId = parsedData.userId ?? null
        this.name = parsedData.name ?? null
        this.surname = parsedData.surname ?? null
        this.isTeacher = parsedData.isTeacher ?? null
        this.isStudent = parsedData.isStudent ?? null
      }
    },

    setUser(user: {
      userId?: number
      name?: string
      surname?: string
      isTeacher?: boolean
      isStudent?: boolean
    }) {
      this.userId = user.userId ?? null
      this.name = user.name ?? null
      this.surname = user.surname ?? null
      this.isTeacher = user.isTeacher ?? null
      this.isStudent = user.isStudent ?? null

      const userData = {
        userId: this.userId,
        name: this.name,
        surname: this.surname,
        isTeacher: this.isTeacher,
        isStudent: this.isStudent,
      }
      sessionStorage.setItem('userData', JSON.stringify(userData))
    },

    logout() {
      this.tokenExpiration = null
      this.userId = null
      this.name = null
      this.surname = null
      this.isTeacher = null
      this.isStudent = null

      sessionStorage.removeItem('attend-me:userAuthData')
      sessionStorage.removeItem('userData')

      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }
    },
  },
})
