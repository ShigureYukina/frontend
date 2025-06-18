<template>
  <el-form :model="recipe" label-width="120px" @submit.prevent="handleSubmit">
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createOrUpdateRecipe, getRecipeDetail } from '@/api'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: String // 接收来自路由的 id
})

const router = useRouter()
const userStore = useUserStore()
const recipe = ref({
  recipeID: null,
  title: '',
  ingredients: '',
  difficulty: '中等',
  steps: '',
  recipeTypeNames: '',
  userID: userStore.userId
})

const isEditMode = computed(() => !!props.id)

const handleSubmit = async () => {
  // 如果是编辑模式，确保 recipeID 存在
  if (isEditMode.value) {
    recipe.value.recipeID = parseInt(props.id)
  }
  const res = await createOrUpdateRecipe(recipe.value)
  router.push(`/recipe/${res.data}`)
}

onMounted(async () => {
  if (isEditMode.value) {
    // 如果是编辑模式，获取菜谱详情并填充表单
    const res = await getRecipeDetail(props.id)
    const recipeData = res.data.recipe
    recipe.value.title = recipeData.title
    recipe.value.ingredients = recipeData.ingredients
    recipe.value.difficulty = recipeData.difficulty
    recipe.value.steps = recipeData.steps
    recipe.value.recipeTypeNames = recipeData.recipeTypeNames
  }
})
</script>