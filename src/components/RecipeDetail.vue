<template>
  <div v-if="recipe">
    <h1>{{ recipe.recipe.title }}</h1>
    <el-button @click="toggleFavorite" type="warning" :plain="!isFavorite">
      {{ isFavorite ? '已收藏' : '收藏' }}
    </el-button>

  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {getRecipeDetail, postReview, favoriteRecipe, getFavoriteRecipes} from '@/api'

const props = defineProps({id: String})
const recipe = ref(null)
const newReview = ref({rating: 5, comment: '', recipeId: parseInt(props.id)})
const favoriteList = ref([])

// 计算属性，判断当前菜谱是否在收藏列表中
const isFavorite = computed(() => {
  return favoriteList.value.some(fav => fav.recipeID === recipe.value.recipe.recipeID)
})

const fetchRecipe = async () => {
  const res = await getRecipeDetail(props.id)
  recipe.value = res.data
}

const fetchFavorites = async () => {
  const res = await getFavoriteRecipes()
  favoriteList.value = res.data.recipes || []
}

const toggleFavorite = async () => {
  const recipeId = recipe.value.recipe.recipeID
  await favoriteRecipe({
    recipeId: recipeId,
    isFavorite: !isFavorite.value
  })
  // 重新获取收藏列表以更新状态
  await fetchFavorites()
}


const submitReview = async () => {
  await postReview(newReview.value)
  fetchRecipe()
  newReview.value.comment = ''
}

onMounted(async () => {
  await fetchRecipe()
  await fetchFavorites()
})
</script>