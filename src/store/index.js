import {defineStore} from "pinia";
import {getUserInfo} from "@/api/index.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('satoken') || '',
        userId: localStorage.getItem('userId') || '',
        username: localStorage.getItem('username') || '',
        isAdmin: localStorage.getItem('isAdmin') === 'true' || false,
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
            this.isAdmin = false
            localStorage.clear()
        },
        async fetchUserInfo() {
            if (!this.userId) {
                this.isAdmin = false
                return
            }
            try {
                const res = await getUserInfo(this.userId)
                if (res.data && res.data.code === 200) {
                    const user = res.data.data
                    this.isAdmin = Number(user.userRole) === 1
                    this.username = user.username
                    localStorage.setItem('isAdmin', this.isAdmin.toString())
                    localStorage.setItem('username', this.username)
                    console.log('isAdmin 设置为:', this.isAdmin)
                } else {
                    this.isAdmin = false
                }
            } catch (error) {
                console.error('获取用户信息失败:', error)
                this.isAdmin = false
            }
        }
    }
})
