<template>
  <div class="auth-wrapper">
    <div class="auth-panel">
      <div class="toggle-tabs">
        <el-button-group>
          <el-button :type="isLogin ? 'primary' : 'default'" @click="isLogin = true">登录</el-button>
          <el-button :type="!isLogin ? 'primary' : 'default'" @click="isLogin = false">注册</el-button>
        </el-button-group>
      </div>

      <transition name="fade">
        <div v-if="isLogin" key="login" class="form-box">
          <h2 class="auth-title">欢迎回来</h2>
          <el-form :model="loginForm" label-position="top">
            <el-form-item label="邮箱">
              <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" />
            </el-form-item>
            <el-button type="primary" @click="handleLogin" class="submit-btn" size="large" round>立即登录</el-button>
          </el-form>
        </div>

        <div v-else key="register" class="form-box">
          <h2 class="auth-title">创建新账户</h2>
          <el-form :model="registerForm" label-position="top">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="registerForm.password" type="password" show-password placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="registerForm.confirmPassword" type="password" show-password placeholder="请再次输入密码" />
            </el-form-item>
            <el-button type="primary" @click="handleRegister" class="submit-btn" size="large" round>立即注册</el-button>
          </el-form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { login, register, getUserInfo } from '@/api/index.js'
import { useUserStore } from '@/store/index.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 登录/注册后获取用户详情并更新 store
const fetchUserInfo = async (userId) => {
  try {
    const res = await getUserInfo(userId)
    if (res.code === 200 && res.data) {
      userStore.username = res.data.username
      userStore.userId = res.data.userId
      userStore.isAdmin = res.data.userRole === 1  // 假设1是管理员
      localStorage.setItem('isAdmin', userStore.isAdmin)
      localStorage.setItem('username', userStore.username)
      localStorage.setItem('userId', userStore.userId)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

onMounted(() => {
  if (route.name === 'Register') {
    isLogin.value = false
  }
})

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    ElMessage.error('请输入邮箱和密码')
    return
  }
  try {
    const response = await login(loginForm.value)
    const res = response.data
    if (res.code === 200) {
      userStore.login(res.data) // ✅ 保存 token 和 userId
      await userStore.fetchUserInfo() // ✅ 从后端获取 userRole 设置 isAdmin
      ElMessage.success('登录成功')
      await router.push('/')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录时发生错误')
    console.error('登录失败:', error)
  }
}



const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  try {
    const response = await register(registerForm.value)
    const res = response.data
    if (res.code === 200) {
      userStore.login(res.data)
      await fetchUserInfo(res.data.userId)
      ElMessage.success('注册成功')
      await router.push('/')
    } else {
      ElMessage.error(res.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '注册时发生错误')
    console.error('注册失败:', error)
  }
}
</script>


<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #f0f4ff, #e8f7ff);
  padding: 20px;
}

.auth-panel {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
  width: 100%;
  max-width: 460px;
}

.toggle-tabs {
  text-align: center;
  margin-bottom: 30px;
}

.auth-title {
  font-size: 22px;
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
