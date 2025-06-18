import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from '@/store'

const routes = [{path: '/', name: 'Home', component: () => import('@/views/Home.vue')}, // 将登录和注册路由指向新的AuthView
    {path: '/login', name: 'Login', component: () => import('@/views/AuthView.vue')}, {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/AuthView.vue')
    }, {
        path: '/recipe/:id',
        name: 'RecipeDetail',
        component: () => import('@/views/RecipeDetailView.vue'),
        props: true
    },{
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true },
        props: true // 让 route.params 直接以 props 形式传给组件
    },
    {
        path: '/create-recipe',
        name: 'CreateRecipe',
        component: () => import('@/components/RecipeForm.vue'),
        meta: {requiresAuth: true}
    }, {
        path: '/recipe/:id/edit',
        name: 'EditRecipe',
        component: () => import('@/components/RecipeForm.vue'),
        props: true, // 允许将路由参数作为 props 传递给组件
        meta: {requiresAuth: true}
    }, {
        path: '/admin',
        name: 'AdminPanel',
        component: () => import('@/views/AdminPanel.vue'),
        meta: {requiresAdmin: true} // 可配合路由守卫限制访问
    }

]

const router = createRouter({
    history: createWebHistory(), routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (to.meta.requiresAuth && !userStore.token) {
        next('/login')
    } else {
        next()
    }
})

export default router