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
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.activity-list {
  padding-top: 1rem;
  margin: 1rem;
}

.post-list {
  margin: 1rem;
}
</style>
