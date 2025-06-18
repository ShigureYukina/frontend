<template>
  <div v-if="user">
    <el-form v-if="isEditing" :model="editForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存</el-button>
        <el-button @click="isEditing = false">取消</el-button>
      </el-form-item>
    </el-form>

    <div v-else>
      <h1>{{ user.username }}</h1>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <el-button @click="startEditing">编辑个人资料</el-button>
    </div>

    <el-divider />

    <h2>我的收藏</h2>
    <RecipeList :recipes="favoriteRecipes" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getUserInfo, getFavoriteRecipes, updateUserInfo } from '@/api'
import { useUserStore } from '@/store'
import RecipeList from '@/components/RecipeList.vue'

const user = ref(null)
const favoriteRecipes = ref([])
const userStore = useUserStore()
const isEditing = ref(false)
const editForm = reactive({ username: '', email: '' })

const fetchUser = async () => {
  const res = await getUserInfo(userStore.userId)
  user.value = res.data
}

const fetchFavorites = async () => {
  const res = await getFavoriteRecipes()
  favoriteRecipes.value = res.data.recipes
}

const startEditing = () => {
  editForm.username = user.value.username
  editForm.email = user.value.email
  isEditing.value = true
}

const saveProfile = async () => {
  await updateUserInfo(editForm)
  await fetchUser() // 重新获取用户信息
  isEditing.value = false
}

onMounted(() => {
  fetchUser()
  fetchFavorites()
})
</script>