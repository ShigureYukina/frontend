import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('satoken') || '',
        userId: localStorage.getItem('userId') || '',
        username: localStorage.getItem('username') || ''
    }),
    actions: {
        login(data) {
            this.token = data.token
            this.userId = data.userId
            this.username = data.username
            localStorage.setItem('satoken', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('username', data.username)
        },
        logout() {
            this.token = ''
            this.userId = ''
            this.username = ''
            localStorage.clear()
        }
    }
})