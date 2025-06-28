<script setup>
import {ref, onMounted} from 'vue'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {getUserInfo} from "@/api/index.js";

const userStore = useUserStore()
const router = useRouter()


const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const userRole = ref('') // 假设在 setup 中声明

const fetchUserRole = async () => {
  const userId = userStore.userId

  try {
    const res = await getUserInfo(userId)
    userRole.value = res.data.userRole
    console.log('用户角色:', userRole.value)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
const fetchUser = async () => {
  const userId = userStore.userId
  if (!userId) {
    console.error('用户 ID 无效')
    return
  }

  try {
    const res = await getUserInfo(userId)  // 确保 userId 是有效的
    // 处理返回数据
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
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
      <h2 style="margin: 0;">粤菜记忆</h2>
    </el-menu-item>
    <div style="flex-grow: 1"/>
    <el-menu-item index="1">
      <router-link to="/">首页</router-link>
    </el-menu-item>
    <el-menu-item index="2" v-if="userStore.token">
      <router-link to="/create-recipe">创建菜谱</router-link>
    </el-menu-item>
    <el-menu-item index="5" v-if="userStore.isAdmin">
      <router-link to="/admin">管理员面板</router-link>
    </el-menu-item>

    <el-sub-menu index="3" v-if="userStore.token">
      <template #title>
        {{ userStore.username }}
      </template>
      <el-menu-item index="3-1">
        <router-link :to="`/profile/${userStore.userId}`">个人中心</router-link>
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
