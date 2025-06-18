<script setup>
import {ref, onMounted} from 'vue'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const userRole = ref(1)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const fetchUserRole = async () => {
  const userId = userStore.userId || 1
  const res = await fetch(`http://localhost:5173/api/userinfo?userId=${userId}`)
  if (!res.ok) throw new Error('获取用户信息失败')
  const data = await res.json()
  userRole.value = data.data.userRole
  console.log('用户角色:', userRole.value)
}

onMounted(() => {
  if (userStore.token) {
    fetchUserRole()
  }
})
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false" style="display: flex; align-items: center;">
    <el-menu-item index="0">
      <h2 style="margin: 0;">美味菜谱</h2>
    </el-menu-item>
    <div style="flex-grow: 1"/>
    <el-menu-item index="1">
      <router-link to="/">首页</router-link>
    </el-menu-item>
    <el-menu-item index="2" v-if="userStore.token">
      <router-link to="/create-recipe">创建菜谱</router-link>
    </el-menu-item>
    <el-menu-item index="5" v-if="userStore.userId === '1'">
      <router-link to="/admin">管理员面板</router-link>
    </el-menu-item>

    <el-sub-menu index="3" v-if="userStore.token">
      <template #title>
        {{ userStore.username }}
      </template>
      <el-menu-item index="3-1">
        <router-link to="/profile">个人中心</router-link>
      </el-menu-item>
      <el-menu-item index="3-2" @click="handleLogout">
        退出登录
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4" v-if="!userStore.token">
      <router-link to="/login">登录/注册</router-link>
    </el-menu-item>
  </el-menu>
</template>
