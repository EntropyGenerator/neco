<script lang="ts" setup>
import type { ActivityEntity } from '@/api/activitylist'
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object as () => ActivityEntity,
    required: true,
  },
})
const isActive = computed(() => {
  const currentdate = new Date()
  return (
    currentdate.getTime() >= props.activity.starttime.getTime() &&
    currentdate.getTime() <= props.activity.endtime.getTime()
  )
})
</script>

<template>
  <div
    class="activity-item"
    :style="{
      border: isActive
        ? '2px solid var(--minecraft-green)'
        : '2px solid var(--minecraft-gray-light)',
    }"
  >
    <img :src="props.activity.image" :alt="props.activity.title + ' image'" />

    <div class="activity-info">
      <div id="date">
        <span v-if="isActive" style="color: green">进行中 </span>
        <span v-else style="color: gray">已结束 </span>
        <span>
          {{ props.activity.starttime.getFullYear() }}-{{
            props.activity.starttime.getMonth() + 1
          }}-{{ props.activity.starttime.getDate() }} -
          {{ props.activity.endtime.getFullYear() }}-{{ props.activity.endtime.getMonth() + 1 }}-{{
            props.activity.endtime.getDate()
          }}
        </span>
      </div>
      <p>{{ props.activity.title }}</p>
      <span> {{ props.activity.content }} </span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.activity-item {
  margin: 1rem;
  border: 2px solid gray;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  box-shadow: 4px 4px rgba(0, 0, 0, 0.7);
}

.activity-item img {
  height: 9rem;
  width: 16rem;
}

.activity-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.activity-info #date {
  font-size: 0.7rem;
}

.activity-info p {
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0;
}
</style>
