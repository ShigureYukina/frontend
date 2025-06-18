import request from './request'

// Auth
export const register = (data) => request({ url: '/auth/register', method: 'post', data })
export const login = (data) => request({ url: '/auth/login', method: 'post', data })

// User
export const getUserInfo = (userId) => request({ url: `/userinfo?userId=${userId}`, method: 'get' })
export const updateUserInfo = (data) => request({ url: '/userinfo', method: 'put', data })

// Recipe
export const createOrUpdateRecipe = (data) => request({ url: '/recipe_manager/recipe', method: 'post', data })
export const getRecipeDetail = (id) => request({ url: `/recipe_manager/recipe_detail/${id}`, method: 'get' })
export const getRecipeTypes = () => request({ url: '/recipe_manager/recipes_type', method: 'get' })
export const searchRecipes = (params) => request({ url: '/recipe_manager/recipes', method: 'get', params })
export const reviewRecipe = (data) => request({ url: '/recipe_manager/review_recipe', method: 'post', data })

// Favorite
export const getFavoriteRecipes = () => request({ url: '/recipe_manager/favorite', method: 'get' })
export const favoriteRecipe = (data) => request({ url: '/recipe_manager/favorite', method: 'post', data })

// Review
export const postReview = (data) => request({ url: '/review', method: 'post', data })