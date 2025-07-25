<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GetNews, GetNewsBrief, type NewsBrief } from '@/api/newslist'
import type { NewsEntity } from '@/api/newslist'
import NewsItem from './NewsItem.vue'
import NewsCard from './NewsCard.vue'

const router = useRouter()
const newsId = useRoute().params.id
const newsBrief = ref<NewsBrief[]>([
  { id: '', image: '', title: '', brief: '' },
  { id: '', image: '', title: '', brief: '' },
  { id: '', image: '', title: '', brief: '' },
  { id: '', image: '', title: '', brief: '' },
])
const news = ref<NewsEntity[]>([])
const page = ref<number>(1)

onMounted(async () => {
  if (newsId === '') {
    router.replace('/news/activities')
  }

  newsBrief.value = await GetNewsBrief()
  news.value = await GetNews(newsId as string, page.value)
})
</script>

<template>
  <div class="news-area">
    <div class="news-overview">
      <div class="overview-divide divide-1" style="height: 100%; width: 100%;">
        <NewsCard
          class="vertical"
          style="animation: fade-in-down .5s ease-in-out .3s forwards;"
          :news-brief="newsBrief[0]"
          button-text="更多活动"
        />
        <div class="overview-divide vertical">
          <NewsCard
            class="dynamic-vertical"
            style="animation: fade-in-down .5s ease-in-out .6s forwards;"
            :news-brief="newsBrief[1]"
            button-text="更多信息"
          />
          <div class="overview-divide divide-2">
            <NewsCard
              class="vertical"
              style="animation: fade-in-down .5s ease-in-out .9s forwards;"
              :news-brief="newsBrief[2]"
              button-text="往期社刊"
            />
            <NewsCard
              class="vertical"
              style="animation: fade-in-down .5s ease-in-out 1.2s forwards;"
              :news-brief="newsBrief[3]"
              button-text="前去灌水"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="news-list-panel">
      <div class="news-list-container">
        <NewsItem
          v-for="item in news"
          :key="item.id"
          :news="item"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.news-area {
  width: 100%;
  min-height: calc(100vh - 5rem);
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vertical {
  flex-direction: column;
}

.news-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  margin-bottom: 2rem;
}

.overview-divide {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.news-list-panel {
  background-color: #313131;
}

.news-list-container {
  width: 100%;
  display: grid;
  gap: 1.5rem;
}

@media screen and (max-width: 1920px) {
  .divide-1 {
    flex-direction: row;
  }

  .news-list-container {
    grid-template-columns: repeat(4, minmax(17.5rem, 21.75rem));
  }
}

@media screen and (max-width: 1312px) {
  .divide-1 {
    flex-direction: column;
  }

  .news-list-container {
    grid-template-columns: repeat(3, minmax(17.5rem, 21.75rem));
  }
}

@media screen and (max-width: 1008px) {
  .news-list-container {
    grid-template-columns: repeat(2, minmax(17.5rem, 21.75rem));
  }
}

@media screen and (max-width: 623px) {
  .dynamic-vertical {
    flex-direction: column;
  }

  .divide-2 {
    flex-direction: column;
  }
  
  .news-list-container {
    grid-template-columns: repeat(1, minmax(17.5rem, 21.75rem));
  }
}
</style>
