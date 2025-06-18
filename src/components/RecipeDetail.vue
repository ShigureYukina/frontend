<template>
  <div v-if="recipe" class="recipe-detail-view">
    <el-page-header @back="router.back()" :content="recipe.recipe.title" class="page-header"/>

    <el-row :gutter="30">
      <!-- 左侧主卡片 -->
      <el-col :md="14">
        <el-card class="main-card">
          <div class="header-section">
            <h1>{{ recipe.recipe.title }}</h1>
            <el-button
                :type="isFavorite ? 'warning' : 'default'"
                :icon="isFavorite ? StarFilled : Star"
                @click="toggleFavorite"
                circle
            />
          </div>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="分类">{{ recipe.recipe.recipeTypeNames }}</el-descriptions-item>
            <el-descriptions-item label="难度">{{ recipe.recipe.difficulty }}</el-descriptions-item>
            <el-descriptions-item label="评分">
              <el-rate
                  :model-value="recipe.recipe.rating"
                  disabled
                  show-score
                  score-template="{value} 分"
              />
            </el-descriptions-item>
          </el-descriptions>

          <el-divider/>

          <h3>🥬 食材</h3>
          <p class="plain-text">{{ recipe.recipe.ingredients }}</p>

          <el-divider/>

          <h3>📋 步骤</h3>
          <div class="step-cards">
            <el-card
                v-for="(step, index) in stepList"
                :key="index"
                class="step-card"
                shadow="hover"
            >
              <div class="step-header">第 {{ index + 1 }} 步</div>
              <div class="step-content">{{ step }}</div>
            </el-card>
          </div>

        </el-card>
      </el-col>

      <!-- 右侧操作栏 -->
      <el-col :md="10">
        <el-affix :offset="80">
          <el-card class="sidebar-card">
            <h3>操作</h3>
            <el-button
                :type="isFavorite ? 'warning' : 'default'"
                :icon="isFavorite ? StarFilled : Star"
                @click="toggleFavorite"
                class="w-full"
            >
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </el-card>

        </el-affix>
      </el-col>
    </el-row>
  </div>

  <el-empty v-else description="正在加载食谱..."/>
</template>
<script setup>
import {ref, onMounted, computed} from 'vue'
import {getRecipeDetail, updateState, favoriteRecipe, getFavoriteRecipes} from '@/api'
import {Star, StarFilled} from '@element-plus/icons-vue'
import router from "@/router/index.js";

const props = defineProps({id: String})

const recipe = ref(null)
const newReview = ref({rating: 5, comment: '', recipeId: parseInt(props.id)})
const favoriteList = ref([])

const isFavorite = computed(() => {
  return favoriteList.value?.some(fav => fav.recipeID === recipe.value?.recipe.recipeID)
})

const fetchRecipe = async () => {
  const res = await getRecipeDetail(props.id)
  recipe.value = res.data
}

const fetchFavorites = async () => {
  try {
    const res = await getFavoriteRecipes()
    favoriteList.value = res.data.recipes || []
  } catch {
    favoriteList.value = []
  }
}

const toggleFavorite = async () => {
  const recipeId = recipe.value.recipe.recipeID
  await favoriteRecipe({recipeId, isFavorite: !isFavorite.value})
  await fetchFavorites()
}

const stepList = computed(() => {
  if (!recipe.value || !recipe.value.recipe.steps) return []
  // 支持数字开头或换行分隔
  return recipe.value.recipe.steps
      .split(/\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
})

const submitReview = async () => {
  await updateState(newReview.value)
  await fetchRecipe()
  newReview.value.comment = ''
}
const reviews = computed(() => recipe.value?.reviews || [])


onMounted(async () => {
  await fetchRecipe()
  await fetchFavorites()
})
</script>
<style scoped>
.recipe-detail-view {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 标题样式 */
h3 {
  margin-top: 30px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-card {
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #fdfdfd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.step-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .recipe-detail-view {
    padding: 10px;
  }

  .el-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .sidebar-card {
    margin-top: 20px;
  }
}


</style>

