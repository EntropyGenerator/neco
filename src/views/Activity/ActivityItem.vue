<script lang="ts" setup>
import type { ActivityEntity } from '@/api/activitylist'
import MinecraftButton3D from '@/components/utils/MinecraftButton3D.vue'
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
  <MinecraftButton3D class="activity-item">
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
  </MinecraftButton3D>
</template>

<style lang="css" scoped>
.activity-item {
  margin-bottom: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
