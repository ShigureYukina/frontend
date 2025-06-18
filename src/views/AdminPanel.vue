<template>
  <div class="admin-review-panel">
    <h2>所有菜谱列表</h2>
    <el-table
        v-loading="loading"
        :data="recipes"
        style="width: 100%"
        :empty-text="'暂无菜谱'"
        border
    >
      <el-table-column prop="recipeID" label="ID" width="80"/>
      <el-table-column prop="title" label="菜谱标题"/>
      <el-table-column prop="ingredients" label="食材"/>
      <el-table-column prop="difficulty" label="难度" width="100"/>
      <el-table-column prop="uploadTime" label="上传时间" width="180"/>

      <!-- 审核状态列 -->
      <el-table-column label="审核状态" width="120">
        <template #default="{ row }">
          <span v-if="row.reviewState === 1" style="color: green;">已通过</span>
          <span v-else-if="row.reviewState === 0" style="color: orange;">待审核</span>
          <span v-else style="color: red;">未知状态</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button
              v-if="row.reviewState === 0"
              type="success"
              size="small"
              @click="approve(row.recipeID)"
          >通过
          </el-button>

          <el-button
              v-if="row.reviewState === 0"
              type="danger"
              size="small"
              @click="reject(row.recipeID)"
              style="margin-left: 8px;"
          >拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import request from '@/api/request'
import {updateState} from "@/api/index.js";

const recipes = ref([])
const loading = ref(false)

const fetchRecipes = async () => {
  loading.value = true
  try {
    // 先调用批量接口拿到所有 recipeID
    const listRes = await request({
      url: '/recipe_manager/recipes',
      method: 'get'
    })
    if (listRes.data && Array.isArray(listRes.data)) {
      const ids = listRes.data.map(item => item.recipeID)
      const details = []
      // 用for循环依次请求详情
      for (const id of ids) {
        try {
          const detailRes = await request({
            url: `/recipe_manager/recipe_detail/${id}`,
            method: 'get'
          })
          if (detailRes.data && detailRes.data.recipe) {
            details.push({
              ...detailRes.data.recipe,
              reviewState: detailRes.data.recipe.reviewState ?? null
            })
          }
        } catch (err) {
          console.warn(`获取菜谱详情失败 id=${id}`, err)
        }
      }
      recipes.value = details
    } else {
      ElMessage.error('获取菜谱列表失败')
    }
  } catch (e) {
    ElMessage.error('请求异常')
  } finally {
    loading.value = false
  }
}

const approve = async (recipeID) => {
  try {
    const res = await updateState({ recipeId: recipeID, reviewState: true })

    if (res.code === 200) {
      ElMessage.success('审核通过')
      await fetchRecipes()
    } else {
      ElMessage.error('审核失败')
    }
  } catch (e) {
    ElMessage.error('审核请求异常')
  }
}


const reject = async (recipeID) => {
  try {
    const res = await request({
      url: '/recipe_manager/review_recipe',
      method: 'post',
      data: {recipeId: recipeID, reviewState: false}
    })
    if (res.data && res.data.reviewState === false) {
      ElMessage.success('审核拒绝')
      await fetchRecipes()
    } else {
      ElMessage.error('拒绝失败')
    }
  } catch {
    ElMessage.error('拒绝失败')
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>


<style scoped>
.admin-review-panel {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
