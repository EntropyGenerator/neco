<script lang="ts" setup>
import type { NewsEntity } from '@/api/newslist'

const props = defineProps({
  news: {
    type: Object as () => NewsEntity,
    required: true
  }
})
</script>

<template>
</template>

<style lang="css" scoped>
.news-item-card {
  width: 90%;
  padding: 2rem;
  margin: 1rem auto;
}
</style>
