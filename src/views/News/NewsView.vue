<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GetNewsNavItems } from '@/api/newslist'

const router = useRouter()
const newsId = useRoute().params.id

onMounted(async () => {
  if (newsId === '') {
    const navItems = await GetNewsNavItems()
    router.replace('/news/' + navItems[0].target)
  }
})
</script>

<template>
  <div class="news-area">
    {{ newsId }}
    <div></div>
  </div>
</template>

<style lang="css" scoped>
.news-area {
  padding-top: 9rem;
  display: flex;
  flex-direction: column;
}
</style>
