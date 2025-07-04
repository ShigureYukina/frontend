import {defineStore} from "pinia";
import {getUserInfo} from "@/api/index.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('satoken') || '',
        userId: localStorage.getItem('userId') || '',
        username: localStorage.getItem('username') || '',
        isAdmin: localStorage.getItem('isAdmin') === '1' || false,
    }),
    actions: {
        login(data) {
            this.token = data.token
            this.userId = data.userId
            this.username = data.username
            this.userRole = data.userRole
            localStorage.setItem('satoken', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('username', data.username)
        },
        logout() {
            this.token = ''
            this.userId = ''
            this.username = ''
            this.userRole = null
            localStorage.clear()
        },
        updateUsername(newUsername) {
            if (newUsername) {
                this.username = newUsername
                localStorage.setItem('username', newUsername)
            }
        },
        async fetchUserInfo() {
            if (!this.userId) {
                this.isAdmin = false
                return
            }
            try {
                const res = await getUserInfo(this.userId)
                console.log(res.data)
                if (res.data && res.data.userRole === 1) {
                    console.log(res.data)
                    const user = res.data
                    this.isAdmin = true
                    this.username = user.username
                    localStorage.setItem('isAdmin', this.isAdmin.toString())
                    localStorage.setItem('username', this.username)

                    console.log(this.isAdmin)
                } else {
                    console.log("不是管理")
                    this.isAdmin = false
                }
            } catch (error) {
                console.error('获取用户信息失败:', error)
                this.isAdmin = false
            }
        }
    }
})
