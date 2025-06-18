<!--<template>-->
<!--  <div class="comment-section">-->
<!--    <el-card class="submit-review-card" v-if="userId">-->
<!--      <template #header>-->
<!--        <h3>发表评论</h3>-->
<!--      </template>-->
<!--      <el-rate v-model="newReview.rating" show-score/>-->
<!--      <el-input-->
<!--          v-model="newReview.comment"-->
<!--          type="textarea"-->
<!--          placeholder="分享你的体验..."-->
<!--          :rows="3"-->
<!--      />-->
<!--      <el-button type="primary" class="mt-2" @click="submitReview" :loading="loading">-->
<!--        提交-->
<!--      </el-button>-->
<!--    </el-card>-->

<!--    <el-card class="comment-list-card">-->
<!--      <template #header>-->
<!--        <h3>用户评论 ({{ reviews.length }})</h3>-->
<!--      </template>-->

<!--      <el-empty v-if="reviews.length === 0" description="暂无评论"/>-->

<!--      <el-card-->
<!--          v-for="(review, index) in reviews"-->
<!--          :key="index"-->
<!--          class="comment-item"-->
<!--          shadow="hover"-->
<!--      >-->
<!--        <div class="comment-header">-->
<!--          <strong>{{ review.username || '匿名用户' }}</strong>-->
<!--          <span>{{ formatTime(review.createTime) }}</span>-->
<!--        </div>-->
<!--        <el-rate-->
<!--            :model-value="review.rating"-->
<!--            disabled-->
<!--            show-score-->
<!--            size="small"-->
<!--        />-->
<!--        <div class="comment-body">{{ review.comment }}</div>-->
<!--      </el-card>-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import {ref, computed, watch, onMounted} from 'vue'-->
<!--import {useUserStore} from '@/store/index'  // 请按你的实际路径修改-->
<!--import {getRecipeDetail, review} from '@/api'-->
<!--import {ElMessage} from 'element-plus'-->

<!--const props = defineProps({-->
<!--  recipeId: {-->
<!--    type: [String, Number],-->
<!--    required: true-->
<!--  }-->
<!--})-->

<!--const globalStore = useUserStore()-->
<!--const userId = computed(() => globalStore.userId)-->

<!--const recipe = ref(null)-->
<!--const reviews = ref([])-->

<!--const newReview = ref({-->
<!--  recipeId: Number(props.recipeId),-->
<!--  rating: 5,-->
<!--  comment: ''-->
<!--})-->

<!--const loading = ref(false)-->

<!--const fetchRecipe = async () => {-->
<!--  try {-->
<!--    const res = await getRecipeDetail(props.recipeId)-->
<!--    recipe.value = res.data.recipe-->
<!--    reviews.value = res.data.reviews || []-->
<!--  } catch (e) {-->
<!--    console.error('获取食谱详情失败', e)-->
<!--  }-->
<!--}-->

<!--const submitReview = async () => {-->
<!--  if (!newReview.value.comment.trim()) {-->
<!--    ElMessage.warning('请输入评论内容');-->
<!--    return;-->
<!--  }-->

<!--  loading.value = true;-->

<!--  try {-->
<!--    const res = await review(newReview.value);-->
<!--    console.log('评论提交响应:', res);-->
<!--    if (res.code === 200) {-->
<!--      ElMessage.success('评论成功');-->
<!--      newReview.value.comment = '';-->
<!--      newReview.value.rating = 1;-->
<!--      await fetchRecipe(); // 刷新评论列表-->
<!--    } else {-->
<!--      ElMessage.error(res.message || '评论提交失败');-->
<!--    }-->
<!--  } catch (e) {-->
<!--    ElMessage.error('评论提交异常');-->
<!--    console.error(e);-->
<!--  } finally {-->
<!--    loading.value = false;-->
<!--  }-->
<!--};-->



<!--function formatTime(timeString) {-->
<!--  if (!timeString) return ''-->
<!--  return new Date(timeString).toLocaleString()-->
<!--}-->

<!--onMounted(() => {-->
<!--  fetchRecipe()-->
<!--})-->

<!--watch(() => props.recipeId, async (newId) => {-->
<!--  if (newId) {-->
<!--    newReview.value.recipeId = Number(newId)-->
<!--    await fetchRecipe()-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->
<!--.comment-section {-->
<!--  margin-top: 20px;-->
<!--}-->

<!--.submit-review-card {-->
<!--  margin-bottom: 30px;-->
<!--}-->

<!--.comment-list-card {-->
<!--  margin-top: 20px;-->
<!--}-->

<!--.comment-item {-->
<!--  margin-bottom: 16px;-->
<!--}-->

<!--.comment-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  font-size: 14px;-->
<!--  margin-bottom: 8px;-->
<!--  color: #666;-->
<!--}-->

<!--.comment-body {-->
<!--  font-size: 15px;-->
<!--  color: #333;-->
<!--  line-height: 1.6;-->
<!--}-->

<!--.mt-2 {-->
<!--  margin-top: 10px;-->
<!--}-->
<!--</style>-->
