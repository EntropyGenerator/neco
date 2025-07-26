<script lang="ts" setup>
import { type ServerEntity } from '../../api/serverlist'

const props = defineProps({
  server: {
    type: Object as () => ServerEntity,
    required: true,
  },
})
</script>

<template>
  <div class="item-border">
    <img
      :src="props.server.icon"
      alt="icon"
      width="64"
      height="64"
      style="border: 1px solid grey"
    />
    <div class="item-info">
      <span style="font-weight: bolder">{{ props.server.name }}</span>
      <span>{{ props.server.description }}</span>
    </div>
    <div class="item-status">
      <span v-if="props.server.playerCount != -1">{{ props.server.playerCount }}</span>
      <span v-if="props.server.playerCount != -1">/</span>
      <span v-if="props.server.capacity != -1">{{ props.server.capacity }}</span>
      <span style="margin-top: auto">
        <a v-if="props.server.onlineMapUrl != ''" :href="props.server.onlineMapUrl">网页地图</a>
        <span v-if="props.server.onlineMapUrl != '' && props.server.serverUrl != ''">/</span>
        <a v-if="props.server.serverUrl != ''" :href="props.server.serverUrl">服务器地址</a>
      </span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.item-border {
  width: 60%;
  border: 2px solid gray;
  padding: 4px;
  display: flex;
  flex-direction: row;
  margin: 1rem auto;
  min-width: 20rem;
  background-color: rgba(0, 0, 0, 0.5);
  background-size: 100% auto;
  box-shadow: 4px 4px rgba(0, 0, 0, 0.7);
  animation: fade-in-right 1s ease-in-out forwards;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  margin-left: 1rem;
}

.item-status {
  display: flex;
  flex-direction: column;
  text-align: right;
  margin-left: auto;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
