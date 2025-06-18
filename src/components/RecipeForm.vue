<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <h1>{{ isEditMode ? '编辑菜谱' : '创建新菜谱' }}</h1>
      </template>
      <el-form :model="recipe" label-width="120px" @submit.prevent="handleSubmit">
        <el-form-item label="菜谱标题">
          <el-input v-model="recipe.title"/>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="recipe.recipeTypeNames" placeholder="多个分类请用逗号隔开"/>
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="recipe.difficulty">
            <el-radio label="简单"/>
            <el-radio label="中等"/>
            <el-radio label="困难"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="食材">
          <el-input v-model="recipe.ingredients" type="textarea" :rows="4"/>
        </el-form-item>
        <el-form-item label="步骤">
          <el-input v-model="recipe.steps" type="textarea" :rows="8"/>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="recipe.videoLink" placeholder="可选填"/>
        </el-form-item>
        <el-form-item label="图片链接（可逗号隔开）">
          <el-input v-model="recipe.imageLinks" placeholder="多个图片请用英文逗号隔开"/>
        </el-form-item>

        <el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">{{ isEditMode ? '更新' : '创建' }}</el-button>
            <el-button @click="router.back()">取消</el-button>
            <el-button type="success" @click="fillTestData">一键填充测试数据</el-button>
          </el-form-item>

          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {createOrUpdateRecipe, getRecipeDetail} from '@/api'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const props = defineProps({
  id: String // 接收来自路由的 id
})

const router = useRouter()
const userStore = useUserStore()
const fillTestData = () => {
  recipe.value.title = '番茄炒蛋'
  recipe.value.ingredients = '鸡蛋2个, 番茄1个, 盐适量, 油适量'
  recipe.value.difficulty = '简单'
  recipe.value.steps = `1. 番茄洗净切块；\n2. 鸡蛋打散加少许盐；\n3. 热锅冷油，炒鸡蛋至凝固盛出；\n4. 再炒番茄，加少许盐出汁；\n5. 倒入鸡蛋翻炒均匀即可`
  recipe.value.recipeTypeNames = '家常菜'
  recipe.value.videoLink = 'https://www.w3schools.com/html/mov_bbb.mp4' // 示例视频
  recipe.value.imageLinks = [
    'https://cdn.pixabay.com/photo/2017/05/07/08/56/salad-2297011_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg'
  ].join(',')
}

const recipe = ref({
  recipeID: null,
  title: '',
  ingredients: '',
  difficulty: '中等',
  steps: '',
  recipeTypeNames: '',
  recipeTypeIds: '',       // 可选：支持保存 ID
  videoLink: '',
  imageLinks: '',
  userID: userStore.userId,
  reviewState: 0           // 创建时默认未审核
})

const isEditMode = computed(() => !!props.id)

const handleSubmit = async () => {
  if (!recipe.value.title || !recipe.value.ingredients || !recipe.value.steps) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEditMode.value) {
    recipe.value.recipeID = parseInt(props.id)
  }

  try {
    const res = await createOrUpdateRecipe(recipe.value)
    ElMessage.success(isEditMode.value ? '更新成功' : '创建成功')
    router.push(`/recipe/${res.data}`)
  } catch (e) {
    ElMessage.error('保存失败')
    console.error(e)
  }
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const res = await getRecipeDetail(props.id)
      const recipeData = res.data.recipe
      recipe.value.recipeID = recipeData.recipeID
      recipe.value.title = recipeData.title
      recipe.value.ingredients = recipeData.ingredients
      recipe.value.difficulty = recipeData.difficulty
      recipe.value.steps = recipeData.steps
      recipe.value.recipeTypeNames = recipeData.recipeTypeNames || ''
      recipe.value.recipeTypeIds = recipeData.recipeTypeIds || ''
      recipe.value.videoLink = recipeData.videoLink || ''
      recipe.value.imageLinks = recipeData.imageLinks || ''
      recipe.value.reviewState = recipeData.reviewState ?? 0
    } catch (e) {
      ElMessage.error('获取菜谱信息失败')
    }
  }
})
</script>
