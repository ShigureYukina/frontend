<template>
  <el-form :model="form" @submit.prevent="handleRegister">
    <el-form-item label="用户名">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '@/api'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const form = ref({ username: '', email: '', password: '' })
const userStore = useUserStore()
const router = useRouter()

const handleRegister = async () => {
  const res = await register(form.value)
  userStore.login(res.data)
  router.push('/profile')
}
</script>