<!--<template>-->
<!--  <el-tabs v-model="activeTab" class="profile-tabs">-->
<!--    <el-tab-pane label="基本资料" name="profile">-->
<!--      <div v-if="user" class="profile-content">-->
<!--        <div v-if="!isEditing">-->
<!--          <h1>{{ user.username }}</h1>-->
<!--          <p><strong>Email:</strong> {{ user.email }}</p>-->
<!--          <el-button v-if="isCurrentUser" @click="startEditing">编辑个人资料</el-button>-->
<!--        </div>-->

<!--        <div v-else>-->
<!--          <el-card class="edit-card">-->
<!--            <template #header>-->
<!--              <div class="card-header">-->
<!--                <span>修改基本信息</span>-->
<!--              </div>-->
<!--            </template>-->
<!--            <el-form :model="editForm" label-width="100px">-->
<!--              <el-form-item label="用户名">-->
<!--                <el-input v-model="editForm.username"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="邮箱">-->
<!--                <el-input v-model="editForm.email" disabled title="邮箱不可修改"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item>-->
<!--                <el-button type="primary" @click="saveProfile">保存基本信息</el-button>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </el-card>-->


<!--          <el-button @click="isEditing = false" style="margin-top: 20px;">取消编辑</el-button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </el-tab-pane>-->

<!--    <el-tab-pane label="收藏菜谱" name="favorites">-->
<!--      <RecipeList :recipes="favoriteRecipes" />-->
<!--    </el-tab-pane>-->

<!--    <el-tab-pane label="ta的菜谱" name="my-recipes">-->
<!--      <RecipeList :recipes="myRecipes" />-->
<!--    </el-tab-pane>-->
<!--  </el-tabs>-->
<!--</template>-->

<!--<script setup>-->
<!--import {ref, onMounted, reactive, computed} from 'vue';-->
<!--import { ElMessage } from 'element-plus';-->
<!--import { getUserInfo, getFavoriteRecipes, updateUserInfo, searchRecipes } from '@/api';-->
<!--import { useUserStore } from '@/store';-->
<!--import RecipeList from '@/components/RecipeList.vue';-->
<!--import {useRoute} from "vue-router";-->
<!--const props = defineProps({-->
<!--  id: {-->
<!--    type: String, // 如果传入的 id 是字符串类型-->
<!--    required: true-->
<!--  }-->
<!--})-->
<!--const user = ref(null);-->
<!--const favoriteRecipes = ref([]);-->
<!--const myRecipes = ref([]);-->
<!--const route = useRoute()-->
<!--const userStore = useUserStore()-->
<!--const isEditing = ref(false);-->
<!--const activeTab = ref('profile');-->
<!--// 当前访问的用户 ID（从 URL 参数获取）-->
<!--// 获取当前路由中的用户ID（从URL传参）-->
<!--// 使用 computed 来确保是字符串类型-->
<!--const profileUserId = computed(() => {-->
<!--  return String(route.params.id) // 强制转换为字符串类型-->
<!--})-->


<!--// 当前登录用户的ID-->
<!--const currentUserId = computed(() => userStore.userId)  // 直接用userStore中的userId-->

<!--// 判断是否为当前登录用户-->
<!--const isCurrentUser = computed(() => currentUserId.value === profileUserId.value)-->
<!--const editForm = reactive({ username: '', email: '' });-->
<!--const fetchUser = async () => {-->
<!--  if (userStore.userId) {-->
<!--    const res = await getUserInfo(userStore.userId);-->
<!--    user.value = res.data;-->
<!--  }-->
<!--};-->

<!--const fetchFavorites = async () => {-->
<!--  const res = await getFavoriteRecipes();-->
<!--  // 确保返回的数据是数组-->
<!--  favoriteRecipes.value = Array.isArray(res.data.recipes) ? res.data.recipes : [];-->
<!--};-->

<!--const fetchMyRecipes = async () => {-->
<!--  if (!userStore.userId) return;-->
<!--  try {-->
<!--    const params = { userId: userStore.userId, page: 1, pagesize: 100 };-->
<!--    const res = await searchRecipes(params);-->
<!--    myRecipes.value = res.data || [];-->
<!--  } catch (error) {-->
<!--    console.error("获取我的菜谱失败:", error);-->
<!--  }-->
<!--};-->

<!--const startEditing = () => {-->
<!--  editForm.username = user.value.username;-->
<!--  editForm.email = user.value.email;-->
<!--  isEditing.value = true;-->
<!--};-->
<!--const saveProfile = async () => {-->
<!--  try {-->
<!--    const payload = { username: editForm.username.trim() };-->
<!--    await updateUserInfo(payload);-->
<!--    await fetchUser();-->
<!--    ElMessage.success('基本信息更新成功！');-->
<!--    isEditing.value = false;-->
<!--  } catch (error) {-->
<!--    ElMessage.error('信息更新失败，请重试。');-->
<!--  }-->
<!--};-->






<!--onMounted(() => {-->
<!--  fetchUser();-->
<!--  fetchFavorites();-->
<!--  fetchMyRecipes();-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--.profile-tabs {-->
<!--  padding: 20px;-->
<!--}-->
<!--.profile-content {-->
<!--  padding: 20px;-->
<!--}-->
<!--.edit-card {-->
<!--  margin-bottom: 20px;-->
<!--}-->
<!--</style>-->