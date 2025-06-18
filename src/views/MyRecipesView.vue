<template>
  <div class="my-recipes-page">
    <h1>我的菜谱</h1>
    <p>这里是您创建和发布的所有菜谱。</p>
    <el-divider />
    <RecipeList :recipes="myRecipes" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';
import { searchRecipes } from '@/api';
import RecipeList from '@/components/RecipeList.vue';

const userStore = useUserStore();
const myRecipes = ref([]);

// 获取用户自己发布的菜谱
const fetchMyRecipes = async () => {
  if (!userStore.userId) return;

  try {
    // 调用通用的搜索接口，传入用户ID来筛选
    const params = {
      userId: userStore.userId,
      page: 1,
      pagesize: 100 // 获取该用户的所有菜谱
    };
    const res = await searchRecipes(params);
    myRecipes.value = res.data || [];
  } catch (error) {
    console.error("获取我的菜谱失败:", error);
    myRecipes.value = [];
  }
};

onMounted(() => {
  fetchMyRecipes();
});
</script>

<style scoped>
.my-recipes-page {
  padding: 20px;
}
</style>