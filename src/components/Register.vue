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
import {ref} from 'vue'
import {register} from '@/api'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const form = ref({username: '', email: '', password: ''})
const userStore = useUserStore()
const router = useRouter()

const handleRegister = async () => {
  try {
    // register 现在返回一个原生的 axios 响应
    const response = await register(form.value)
    const res = response.data // 手动提取数据

    // 手动检查业务状态码
    if (res.code === 200) {
      // 假设注册成功后也会返回 token 和用户信息
      userStore.login(res.data)
      router.push('/profile')
      ElMessage.success('注册成功')
    } else {
      ElMessage.error(res.message || '注册失败')
    }
  } catch (error) {
    // 处理网络层或HTTP状态码非2xx的错误
    const message = error.response?.data?.message || error.message || '注册时发生错误'
    ElMessage.error(message)
    console.error('注册失败:', error)
  }
}
</script>