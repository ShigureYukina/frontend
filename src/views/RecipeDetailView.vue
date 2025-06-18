<template>
  <RecipeDetail :id="id" />
</template>

<script setup>
import RecipeDetail from '@/components/RecipeDetail.vue'
defineProps({ id: String })
</script>