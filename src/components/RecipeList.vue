<template>
  <div class="recipe-page">
    <div class="recipe-search-bar" v-if="!props.recipes">
      <el-input
          v-model="searchKeyword"
          placeholder="按标题搜索..."
          clearable
          class="search-input"
      />
      <el-select
          v-model="searchType"
          placeholder="按类别筛选..."
          clearable
          multiple
          collapse-tags
          collapse-tags-tooltip
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
      <template v-if="filteredRecipes.length > 0">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in filteredRecipes" :key="item.recipe.recipeID">
          <el-card class="recipe-card" shadow="hover" v-if="item && item.recipe">

            <el-image
                :src="getFirstImage(item.recipe)"
                fit="cover"
                class="recipe-image"
                :preview-src-list="getImageList(item.recipe)"
                lazy
            >
              <template #placeholder>
                <div class="image-slot">加载中...</div>
              </template>
              <template #error>
                <div class="image-slot"><span>暂无图片</span></div>
              </template>
            </el-image>

            <div class="card-content">
              <h3 class="card-title">{{ item.recipe.title }}</h3>
              <div class="card-type-wrapper">
                <template v-if="item.recipe.recipeTypeNames && typeof item.recipe.recipeTypeNames === 'string'">
                  <el-tag size="small" v-for="tag in item.recipe.recipeTypeNames.split(',')" :key="tag"
                          class="card-type-tag">
                    {{ tag.trim() }}
                  </el-tag>
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
              <el-button type="primary" plain size="small" @click="goToDetail(item.recipe.recipeID)"
                         class="detail-button">
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-col>
      </template>
      <el-empty v-else description="没有找到匹配的菜谱" style="width: 100%;"/>
    </el-row>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {searchRecipes, getRecipeTypes, getRecipeDetail} from '@/api';
import {useRouter} from "vue-router";

const props = defineProps({
  recipes: {
    type: Array,
    required: false
  }
});

const router = useRouter();
const localRecipes = ref([]); // 存储从API获取的 *所有* 菜谱
const recipeTypes = ref([]);
const searchKeyword = ref('');
const searchType = ref([]); // 多选类别

// --- 数据标准化函数 ---
const standardizeRecipes = (recipes) => {
  if (!Array.isArray(recipes) || recipes.length === 0) return [];
  if (recipes[0] && !recipes[0].recipe) return recipes.map(recipe => ({recipe: recipe}));
  return recipes;
};

// --- 本地筛选逻辑 ---
const filteredRecipes = computed(() => {
  let recipesToFilter = localRecipes.value;
  if (searchKeyword.value) {
    recipesToFilter = recipesToFilter.filter(item =>
        item.recipe.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }
  if (searchType.value.length > 0) {
    recipesToFilter = recipesToFilter.filter(item => {
      if (typeof item.recipe.recipeTypeNames !== 'string') return false;
      const types = item.recipe.recipeTypeNames.split(',').map(t => t.trim());
      return searchType.value.some(selectedType => types.includes(selectedType));
    });
  }
  return recipesToFilter;
});

// --- 图片处理函数 ---
const getImageList = (recipe) => {
  const links = recipe?.imageLinks;
  if (typeof links !== 'string' || !links) return [];
  return links.split(',').map(url => url.trim()).filter(Boolean);
};

const getFirstImage = (recipe) => {
  const list = getImageList(recipe);
  return list.length > 0 ? list[1] : '';
};


watch(() => props.recipes, (newVal) => {
  localRecipes.value = standardizeRecipes(newVal);
}, {immediate: true, deep: true});


// --- **核心修改**: 通过API搜索并获取详细数据 ---
const fetchRecipes = async () => {
  if (props.recipes) return;
  try {
    // 1. 先获取简要菜谱列表（假设它返回的是扁平结构）
    const res = await searchRecipes({page: 1, pagesize: 100});
    const briefRecipes = res.data || [];

    // 2. 使用 Promise.all 并行获取所有菜谱的详细信息
    const detailPromises = briefRecipes.map(briefRecipe => {
      // 假设 briefRecipe 包含 recipeID
      const id = briefRecipe.recipeID;
      if (!id) return Promise.resolve(null);
      return getRecipeDetail(id).catch(e => {
        console.error(`获取菜谱详情失败，ID: ${id}`, e);
        return null; // 如果某个请求失败，返回null
      });
    });

    const detailResults = await Promise.all(detailPromises);

    // 3. 过滤掉失败的请求，并将详细数据保存到 localRecipes
    localRecipes.value = detailResults
        .filter(res => res && res.data && res.data.recipe) // 过滤掉null或无效数据
        .map(res => ({ recipe: res.data.recipe })); // 统一为嵌套结构

  } catch (error) {
    console.error("获取菜谱列表失败:", error);
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
  } else {
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