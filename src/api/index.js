import request from './request'
import axios from 'axios'

const postForm = (url, data) => {
    return axios.post(url, new URLSearchParams(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// Auth - 使用 x-www-form-urlencoded 格式发送
export const register = (data) => postForm('/api/auth/register', data)
export const login = (data) => postForm('/api/auth/login', data)


// User
export const getUserInfo = (userId) => request({url: `/userinfo?userId=${userId}`, method: 'get'})
export const updateUserInfo = (data) => request({url: '/userinfo', method: 'put', data})

// Recipe
export const createOrUpdateRecipe = (data) => request({url: '/recipe_manager/recipe', method: 'post', data})
export const getRecipeDetail = (id) => request({url: `/recipe_manager/recipe_detail/${id}`, method: 'get'})
export const getRecipeTypes = () => request({url: '/recipe_manager/recipes_type', method: 'get'})
export const searchRecipes = (params) => request({url: '/recipe_manager/recipes', method: 'get', params})
// 审核菜谱，传入 recipeId 和审核结果 isApproved (true/false)
export const reviewRecipe = (data) => request({
    url: '/recipe_manager/review_recipe',
    method: 'post',
    data
})


// Favorite
export const getFavoriteRecipes = () => request({url: '/recipe_manager/favorite', method: 'get'})
export const favoriteRecipe = (data) => request({url: '/recipe_manager/favorite', method: 'post', data})

// State - 提交审核结果，传入 { recipeId, reviewState }
export const updateState = (data) => request({
    url: '/recipe_manager/review_recipe',
    method: 'post',
    data
})
export const review = (data) => request({url: '/review', method: 'post', data})


