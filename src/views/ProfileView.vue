<template>
  <el-tabs v-model="activeTab" class="profile-tabs">
    <!-- 基本资料 -->
    <el-tab-pane label="基本资料" name="profile">
      <div v-if="user" class="profile-content">
        <div v-if="!isEditing">
          <h1>{{ user.username }}</h1>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <el-button v-if="isCurrentUser" @click="startEditing">编辑个人资料</el-button>
        </div>

        <div v-else>
          <el-card class="edit-card">
            <template #header><span>修改基本信息</span></template>
            <el-form :model="editForm" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="editForm.username"/>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="editForm.email" disabled title="邮箱不可修改"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveProfile">保存</el-button>
                <el-button @click="cancelEditing">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
      <el-empty v-else description="正在加载用户信息..."/>
    </el-tab-pane>

    <!-- 收藏菜谱 -->
    <el-tab-pane v-if="isCurrentUser" :label="isCurrentUser ? '我的收藏' : 'Ta的收藏'" name="favorites">
      <RecipeList v-if="isCurrentUser" :recipes="favoriteRecipes"/>
    </el-tab-pane>

    <!-- 我的菜谱 -->
    <el-tab-pane v-if="isCurrentUser" :label="isCurrentUser ? '我的菜谱' : 'Ta的菜谱'" name="my-recipes">
      <RecipeList :recipes="myRecipes"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import {ref, reactive, computed, watch} from 'vue';
import {useUserStore} from '@/store';
import {ElMessage} from 'element-plus';
import {getUserInfo, getFavoriteRecipes, updateUserInfo, searchRecipes} from '@/api';
import RecipeList from '@/components/RecipeList.vue';

// 接收父组件传入的用户ID
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const userStore = useUserStore();

const user = ref(null);
const favoriteRecipes = ref([]);
const myRecipes = ref([]);
const isEditing = ref(false);
const activeTab = ref('profile');

const editForm = reactive({
  username: '',
  email: ''
});

// 计算当前展示的用户ID
const profileUserId = computed(() => props.id);

// 当前登录用户ID
const loggedInUserId = computed(() => userStore.userId);

// 是否为当前登录用户
const isCurrentUser = computed(() => profileUserId.value === loggedInUserId.value);

// 加载用户数据（资料、收藏、菜谱）
async function fetchProfileData(id) {
  if (!id) return;

  try {
    const userRes = await getUserInfo(id);
    user.value = userRes.data;
  } catch (error) {
    console.error('获取用户信息失败', error);
    user.value = null;
  }

  try {
    const recipesRes = await searchRecipes({userId: id, page: 1, pagesize: 100});
    if (isCurrentUser) {
      myRecipes.value = recipesRes.data || [];
    }
  } catch (error) {
    console.error('获取用户菜谱失败', error);
    myRecipes.value = [];
  }

  try {
    const favRes = await getFavoriteRecipes({userId: id});
    favoriteRecipes.value = Array.isArray(favRes.data.recipes) ? favRes.data.recipes : [];
  } catch (error) {
    console.error('获取收藏菜谱失败', error);
    favoriteRecipes.value = [];
  }
}

const startEditing = () => {
  if (user.value) {
    editForm.username = user.value.username;
    editForm.email = user.value.email;
    isEditing.value = true;
  }
};

const saveProfile = async () => {
  try {
    const payload = {username: editForm.username.trim()};
    await updateUserInfo(payload);
    await fetchProfileData(profileUserId.value);
    isEditing.value = false;
    ElMessage.success('基本信息更新成功！');
  } catch (error) {
    ElMessage.error('信息更新失败，请重试。');
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editForm.username = '';
  editForm.email = '';
};

// 监听用户ID变化，切换页面时自动刷新数据
watch(profileUserId, (newId) => {
  fetchProfileData(newId);
}, {immediate: true});

</script>

<style scoped>
.profile-tabs {
  padding: 20px;
}

.profile-content {
  padding: 20px;
}

.edit-card {
  margin-bottom: 20px;
}
</style>
