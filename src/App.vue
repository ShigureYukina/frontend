<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import Header from '@/components/Header.vue'


import {onMounted} from 'vue'
import {useUserStore} from '@/store'

const userStore = useUserStore()
console.log('isAdmin:', userStore.isAdmin)
console.log('userId:', userStore.userId)
console.log('token:', userStore.token)

onMounted(() => {
  if (userStore.token && userStore.userId) {
    userStore.fetchUserInfo()
  }
})
</script>

