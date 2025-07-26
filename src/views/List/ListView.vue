<script lang="ts" setup>
// TODO: server list
import { onMounted, ref } from 'vue'
import { getServerList, type ServerEntity } from '../../api/serverlist'
import ListItem from './ListItem.vue'

const serverList = ref<ServerEntity[]>([])

onMounted(() => {
  getServerList().then((res) => {
    serverList.value.splice(0, serverList.value.length, ...res)
  })
})
</script>

<template>
  <div class="list-area">
    <ListItem
      class="list-item"
      v-for="server in serverList"
      :style="{
        '--delay': serverList.indexOf(server) * 0.2 + 's',
      }"
      :key="server.name"
      :server="server"
    />
  </div>
</template>

<style lang="css" scoped>
.list-area {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
  box-sizing: border-box;
  background-image: url('/background/list-background.png');
  background-position: center;
  background-size: cover;

  position: relative;
}

.list-area::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: linear-gradient(to bottom, transparent 0%, var(--background-color) 100%);
}

.list-item {
  opacity: 0;
  animation: fade-in-right 0.5s ease-in-out forwards;
  animation-delay: var(--delay);
}
</style>
