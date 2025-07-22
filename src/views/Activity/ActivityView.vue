<script lang="ts" setup>
import { type ActivityEntity, GetActivityList } from '@/api/activitylist'
import { onMounted, ref } from 'vue'
import ActivityItem from './ActivityItem.vue'

const activities = ref<ActivityEntity[]>([])

onMounted(async () => {
  const res = await GetActivityList()
  activities.value.splice(0, activities.value.length, ...res)
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
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
}

.activity-area p {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.activity-list {
  margin: 1rem;
}

.post-list {
  margin: 1rem;
}
</style>
