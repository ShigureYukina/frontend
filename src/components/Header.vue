<template>
  <el-menu mode="horizontal">
    <el-menu-item index="1">
      <router-link to="/">菜谱</router-link>
    </el-menu-item>
    <el-menu-item index="2" v-if="userStore.token">
      <router-link to="/profile">个人资料</router-link>
    </el-menu-item>
    <el-menu-item index="3" v-if="userStore.token">
      <router-link to="/create-recipe">创建菜谱</router-link>
    </el-menu-item>
    <el-menu-item index="4" v-if="!userStore.token">
      <router-link to="/login">登录</router-link>
    </el-menu-item>
    <el-menu-item index="5" v-if="!userStore.token">
      <router-link to="/register">注册</router-link>
    </el-menu-item>
    <el-menu-item index="6" v-if="userStore.token" @click="handleLogout">
      退出
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>