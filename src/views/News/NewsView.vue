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
    <div class="news-list-container"></div>
  </div>
</template>

<style lang="css" scoped>
.news-area {
  width: 100%;
  min-height: calc(100vh - 9rem);
  padding-top: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.news-list-container {
  max-width: 60rem;
  width: 60rem; /* temp! */
  flex: 1;
  background-color: var(--background-card);
}
</style>
