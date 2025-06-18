<template>
  <div class="recipe-page">
    <div class="recipe-search-bar" v-if="!props.recipes">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索菜谱..."
          @keyup.enter="fetchRecipes"
          clearable
          class="search-input"
      />
      <el-select
          v-model="searchType"
          placeholder="选择类别"
          @change="fetchRecipes"
          clearable
          class="type-select"
      >
        <el-option
            v-for="type in recipeTypes"
            :key="type.recipeTypeId"
            :label="type.reciptTypeName"
            :value="type.reciptTypeName"
        />
      </el-select>
    </div>

    <el-row :gutter="20">
      <template v-if="localRecipes.length > 0">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in localRecipes" :key="item.recipe.recipeID">
          <el-card class="recipe-card" shadow="hover" v-if="item && item.recipe">
            <el-image
                :src="getFirstImage(item.recipe)"
                fit="cover"
                class="recipe-image"
                :preview-src-list="getImageList(item.recipe)"
                lazy
            >
              <template #placeholder><div class="image-slot">加载中...</div></template>
              <template #error><div class="image-slot"><span>暂无图片</span></div></template>
            </el-image>

            <div class="card-content">
              <h3 class="card-title">{{ item.recipe.title }}</h3>
              <div class="card-type-wrapper">
                <template v-if="item.recipe.recipeTypeNames && typeof item.recipe.recipeTypeNames === 'string'">
                  <el-tag size="small" v-for="tag in item.recipe.recipeTypeNames.split(',')" :key="tag" class="card-type-tag">{{ tag.trim() }}</el-tag>
                </template>
              </div>
              <el-rate
                  :model-value="item.recipe.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value} 分"
                  class="rate"
              />
              <el-button type="primary" plain size="small" @click="goToDetail(item.recipe.recipeID)" class="detail-button">
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-col>
      </template>
      <el-empty v-else description="暂无菜谱数据" style="width: 100%;"/>
    </el-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {searchRecipes, getRecipeTypes} from '@/api';
import {useRouter} from "vue-router";

const props = defineProps({
  recipes: {
    type: Array,
    required: false
  }
});

const router = useRouter();
const localRecipes = ref([]);
const recipeTypes = ref([]);
const searchKeyword = ref('');
const searchType = ref('');

// --- 数据标准化函数 ---
// 无论数据是扁平还是嵌套，都统一转换为 [{ recipe: {...} }, ...] 的格式
const standardizeRecipes = (recipes) => {
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return [];
  }
  // 如果第一个元素没有 'recipe' 属性，就认为是扁平的
  if (recipes[0] && !recipes[0].recipe) {
    return recipes.map(recipe => ({ recipe: recipe }));
  }
  // 否则，认为已经是嵌套结构
  return recipes;
};


const getImageList = (recipe) => {
  const links = recipe?.imageLinks;
  if (typeof links !== 'string' || !links) return [];
  return links.split(',').map(url => url.trim()).filter(Boolean);
};

const getFirstImage = (recipe) => {
  const list = getImageList(recipe);
  return list.length > 0 ? list[0] : '';
};

// 监听props的变化，并标准化数据
watch(() => props.recipes, (newVal) => {
  localRecipes.value = standardizeRecipes(newVal);
}, {immediate: true, deep: true});


const fetchRecipes = async () => {
  if (props.recipes) return;
  const params = {
    keyword: searchKeyword.value.trim() || '',
    page: 1,
    size: 12
  };
  try {
    const res = await searchRecipes(params);
    localRecipes.value = standardizeRecipes(res.data);
  } catch (error) {
    console.error("获取菜谱失败:", error);
    localRecipes.value = [];
  }
};


const fetchRecipeTypes = async () => {
  try {
    const res = await getRecipeTypes();
    recipeTypes.value = res.data;
  } catch (error) {
    console.error("获取菜谱分类失败:", error);
  }
};

const goToDetail = (id) => {
  router.push(`/recipe/${id}`);
};

onMounted(() => {
  if (!props.recipes) {
    fetchRecipes();
    fetchRecipeTypes();
  }
});
</script>

<style scoped>
/* 样式部分无需修改 */
.recipe-page {
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.recipe-search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  background-color: var(--el-bg-color);
  padding: 20px;
  border-radius: 12px;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.type-select {
  width: 200px;
}

.recipe-card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--el-box-shadow-light);
}

.recipe-image {
  width: 100%;
  height: 180px;
  border-radius: 12px 12px 0 0;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.card-content {
  padding: 18px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-type-wrapper {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 24px;
}

.card-type-tag {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary-light-8);
}

.rate {
  margin-bottom: 12px;
}

.detail-button {
  margin-top: auto;
  width: 100%;
}
</style>