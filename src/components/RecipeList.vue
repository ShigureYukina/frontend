<template>
  <div>
    <div v-if="!recipes"> <el-input v-model="searchKeyword" placeholder="搜索菜谱..." @keyup.enter="fetchRecipes" />
      <el-select v-model="searchType" placeholder="选择类别" @change="fetchRecipes">
        <el-option v-for="type in recipeTypes" :key="type.recipeTypeId" :label="type.reciptTypeName" :value="type.reciptTypeName" />
      </el-select>
    </div>
    <el-table :data="localRecipes" style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="recipeTypeNames" label="类别" />
      <el-table-column prop="rating" label="评分" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push(`/recipe/${row.recipeID}`)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { searchRecipes, getRecipeTypes } from '@/api'

// 接收来自父组件的 prop
const props = defineProps({
  recipes: Array
})

const localRecipes = ref([])
const recipeTypes = ref([])
const searchKeyword = ref('')
const searchType = ref('')

// 计算属性，优先使用 prop 的数据
const dataToShow = computed(() => props.recipes || localRecipes.value)

// 监听 prop 的变化
watch(() => props.recipes, (newVal) => {
  if (newVal) {
    localRecipes.value = newVal
  }
}, { immediate: true })


const fetchRecipes = async () => {
  const params = {
    keywords: searchKeyword.value,
    type: searchType.value,
    page: 1,
    pagesize: 10
  }
  const res = await searchRecipes(params)
  localRecipes.value = res.data
}

const fetchRecipeTypes = async () => {
  const res = await getRecipeTypes()
  recipeTypes.value = res.data
}

onMounted(() => {
  // 只有当 recipes prop 没有被提供时，才去获取数据
  if (!props.recipes) {
    fetchRecipes()
    fetchRecipeTypes()
  }
})
</script>