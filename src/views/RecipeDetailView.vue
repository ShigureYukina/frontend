<template>
  <div class="page-container" v-if="recipe">
    <el-page-header @back="router.back()" :content="recipe.recipe.title" class="page-header"/>

    <div class="main-row">
      <el-row :gutter="30">
        <!-- 左侧主卡片 -->
        <el-col :md="20" :xs="24">
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
            <!-- 图片展示 -->
            <el-divider/>
            <h3>📷 菜谱图片</h3>
            <el-image
                v-for="(url, index) in imageList"
                :key="index"
                :src="url"
                fit="cover"
                style="margin-right: 10px; margin-bottom: 10px; width: 200px; height: 150px; border-radius: 8px;"
                :preview-src-list="imageList"
            />

            <!-- 视频展示 -->
            <el-divider/>
            <h3>🎬 制作视频</h3>
            <video
                v-if="recipe.recipe.videoLink"
                :src="recipe.recipe.videoLink"
                controls
                style="width: 100%; border-radius: 8px;"
            >
              您的浏览器不支持 video 标签。
            </video>
            <el-empty v-else description="暂无视频"/>

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

          <!-- 评论区 -->
          <el-card class="comment-section">
            <h3>💬 评论区</h3>

            <el-form :model="newReview" label-position="top" @submit.prevent="submitReview">
              <el-rate v-model="newReview.rating" show-score/>
              <el-input
                  type="textarea"
                  v-model="newReview.comment"
                  placeholder="写下你的评论..."
                  rows="3"
                  maxlength="200"
                  show-word-limit
                  style="margin-top: 12px;"
              />
              <el-button
                  type="primary"
                  :disabled="!newReview.comment.trim()"
                  style="margin-top: 12px;"
                  @click="submitReview"
              >
                提交评论
              </el-button>
            </el-form>

            <div v-if="reviews.length === 0" class="no-comments">暂无评论，快来抢沙发！</div>


          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>

  <!-- 右侧操作栏 -->
  <!--      <el-col :md="10" :xs="24">-->
  <!--        <el-affix :offset="80">-->
  <!--          <el-card class="sidebar-card">-->
  <!--            <h3>操作</h3>-->
  <!--            <el-button-->
  <!--                :type="isFavorite ? 'warning' : 'primary'"-->
  <!--                :icon="isFavorite ? StarFilled : Star"-->
  <!--                @click="toggleFavorite"-->
  <!--                class="w-full"-->
  <!--            >-->
  <!--              {{ isFavorite ? '已收藏' : '收藏' }}-->
  <!--            </el-button>-->
  <!--          </el-card>-->
  <!--        </el-affix>-->
  <!--      </el-col>-->

  <el-empty v-else description="正在加载食谱..."/>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {
  getRecipeDetail,
  review,
  favoriteRecipe,
  getFavoriteRecipes
} from '@/api'
import {Star, StarFilled} from '@element-plus/icons-vue'
import router from '@/router/index.js'
import {ElMessage} from "element-plus"

const props = defineProps({id: String})
const imageList = computed(() => {
  const links = recipe.value?.recipe?.imageLinks
  if (!links) return []
  return links.split(',').map(url => url.trim()).filter(Boolean)
})

const recipe = ref(null)
const favoriteList = ref([])
const loading = ref(false)

const newReview = ref({
  rating: 5,
  comment: '',
  recipeId: null
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

const isFavorite = computed(() =>
    favoriteList.value.some(fav => fav.recipeID === recipe.value?.recipe?.recipeID)
)

const toggleFavorite = async () => {
  if (!recipe.value) return
  try {
    const recipeId = recipe.value.recipe.recipeID
    await favoriteRecipe({recipeId, isFavorite: !isFavorite.value})
    await fetchFavorites()
  } catch (e) {
    console.error('收藏操作失败:', e)
  }
}

const stepList = computed(() => {
  const steps = recipe.value?.recipe?.steps
  if (!steps) return []
  return steps.split(/\n+/).map(s => s.trim()).filter(Boolean)
})

const submitReview = async () => {
  if (!newReview.value.comment.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  loading.value = true
  try {
    const res = await review(newReview.value)
    if (res.code > 201) {
      ElMessage.success('评论成功')
      newReview.value.comment = ''
      newReview.value.rating = 5
      await fetchRecipe()
    } else {
      ElMessage.error('评论提交失败')
    }
  } catch (e) {
    ElMessage.error('评论提交异常')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const reviews = computed(() => recipe.value?.reviews || [])

const formatDate = dateStr => {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

onMounted(async () => {
  newReview.value.recipeId = parseInt(props.id)
  await fetchRecipe()
  await fetchFavorites()
})
</script>


<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  padding: 30px 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.main-row {
  width: 100%;
  max-width: 1200px;

  flex-direction: row;

}

.page-header {
  margin-bottom: 20px;
}

.main-card {
  width: 100%;
  margin: 0 auto 30px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}


.sidebar-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
}

.step-card {
  padding: 16px;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.step-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.step-header {
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 6px;
}

.step-content {
  line-height: 1.6;
  color: #444;
}

.comment-section {
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.review-content {
  margin: 6px 0 12px 0;
  color: #333;
  white-space: pre-wrap;
}

.no-comments {
  color: #999;
  font-style: italic;
  text-align: center;
  margin: 16px 0;
}

.el-list-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.el-list-item-meta__title {
  font-weight: 600;
  color: #333;
}

.el-list-item-meta__description {
  font-size: 12px;
  color: #999;
}

/* 图片样式 */
.el-image {
  transition: transform 0.3s ease;
}

.el-image:hover {
  transform: scale(1.02);
}



</style>
