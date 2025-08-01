<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import ActivityItem from './ActivityItem.vue'
import {
  GetNews,
  GetNewsBrief,
  GetNewsTotal,
  type NewsBrief,
  type NewsEntity,
} from '@/api/newslist'

const activityBrief = ref<NewsBrief[]>([])
const activityTotal = ref<number>(0)
const activities = ref<NewsEntity[]>([])
const page = ref<number>(1)
// const maxPage = computed(() => {
//   return Math.ceil(activityTotal.value / 12)
// })
// const pageInput = ref('1')
const activityLoading = ref(false)

onMounted(async () => {
  activityBrief.value = await GetNewsBrief()
  activityTotal.value = await GetNewsTotal('activity')
  activityLoading.value = true
  activities.value = await GetNews('activity', page.value)
  activityLoading.value = false
})
</script>

<template>
  <div class="activity-area">
    <p>活动</p>
    <div class="activity-list">
      <ActivityItem v-for="activity in activities" :key="activity.id" :activity="activity" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.activity-area {
  min-height: 100vh;
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  background-color: #303030;
  background-image: url('/background/header-bg.png'), url('/background/bg.png');
  background-repeat: repeat-x, repeat;
  background-position:
    top left,
    top left;
  background-size:
    auto 234px,
    468px;
}

.activity-area p {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  margin: 1.5rem;
  gap: 1.5rem;
}

.post-list {
  margin: 1rem;
}
</style>
