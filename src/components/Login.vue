<template>
  <el-form :model="form" @submit.prevent="handleLogin">
    <el-form-item label="邮箱">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {ref} from 'vue'
import {login} from '@/api'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const form = ref({email: '', password: ''})
const userStore = useUserStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    // login 现在返回一个原生的 axios 响应
    const response = await login(form.value)
    const res = response.data // 我们需要手动从响应中提取数据

    // 手动检查业务状态码
    if (res.code === 200) {
      userStore.login(res.data)
      router.push('/profile')
      ElMessage.success('登录成功')
    } else {
      // 如果 code 不是 200，显示后端返回的错误信息
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    // 处理网络层或HTTP状态码非2xx的错误
    const message = error.response?.data?.message || error.message || '登录时发生错误'
    ElMessage.error(message)
    console.error('登录失败:', error)
  }
}
</script>