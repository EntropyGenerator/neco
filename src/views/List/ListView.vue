<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { GetServerList, type ServerEntity } from '../../api/serverlist'
import { GetLinkEntries, type LinkEntry } from '@/api/links'
import useClipboard from 'vue-clipboard3'
import ListItem from './ListItem.vue'
import LinkItem from './LinkItem.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { toClipboard } = useClipboard()

const serverList = ref<ServerEntity[]>([])
const serverPing = ref<string[]>([])
const focusIndex = ref(-1)
const linkEntries = ref<LinkEntry[]>([])

const onClick = (index: number) => {
  focusIndex.value = index
}

const copy = async (text: string) => {
  try {
    await toClipboard(text)
    toast.success('服务器链接已复制！')
  } catch {
    toast.warning('该服务器暂无链接！')
  }
}

let direction = 1
let pingFrame = 1
let pingTimer: NodeJS.Timeout | undefined = undefined

const refresh = async () => {
  serverList.value = []
  serverList.value = await GetServerList()
  serverPing.value = []
  if (pingTimer) {
    clearInterval(pingTimer)
    pingTimer = undefined
    direction = 1
    pingFrame = 1
  }
  let hasNotOnline = false
  for (let i = 0; i < serverList.value.length; i++) {
    if (!serverList.value[i].realtime) {
      serverPing.value.push(`/UI/server/Server_Unreachable.png`)
    } else {
      hasNotOnline = true
      serverPing.value.push(`/UI/server/Server_Pinging_${pingFrame}.png`)
    }
  }
  if (hasNotOnline) {
    pingTimer = setInterval(() => {
      for (let i = 0; i < serverList.value.length; i++) {
        if (serverPing.value[i].startsWith('/UI/server/Server_Pinging_')) {
          if (serverList.value[i].status !== undefined) {
            if (serverList.value[i].status?.online) {
              const latency = serverList.value[i].status?.latency || 0
              if (latency <= 150) {
                serverPing.value[i] = `/UI/server/Server_Ping_5.png`
              } else if (latency <= 300) {
                serverPing.value[i] = `/UI/server/Server_Ping_4.png`
              } else if (latency <= 450) {
                serverPing.value[i] = `/UI/server/Server_Ping_3.png`
              } else if (latency <= 600) {
                serverPing.value[i] = `/UI/server/Server_Ping_2.png`
              } else {
                serverPing.value[i] = `/UI/server/Server_Ping_1.png`
              }
            } else {
              serverPing.value[i] = `/UI/server/Server_Unreachable.png`
            }
          } else {
            serverPing.value[i] = `/UI/server/Server_Pinging_${pingFrame}.png`
          }
        }
      }
      if (pingFrame > 4) {
        direction = -1
      } else if (pingFrame <= 1) {
        direction = 1
      }
      pingFrame += direction
    }, 150)
  }
}

onMounted(async () => {
  await refresh()
  linkEntries.value = GetLinkEntries()
})
</script>

<template>
  <div class="list-area">
    <section class="list-item-container">
      <h1 id="link-section-title" class="list-title mcfont">服务器列表</h1>
      <ListItem
        class="list-item"
        v-for="(server, index) in serverList"
        :style="{
          '--delay': serverList.indexOf(server) * 0.2 + 's',
        }"
        :ping-icon="serverPing[index]"
        :key="index"
        v-model:server="serverList[index]"
        @click="onClick(index)"
        @dblclick="focusIndex === index ? copy(server.serverUrl || 'undefined') : null"
        :type="focusIndex === index ? 'focus' : ''"
      />
    </section>

    <div style="height: 24px" />

    <section class="list-item-container" aria-labelledby="link-section-title">
      <h1 id="link-section-title" class="list-title mcfont">友情链接</h1>
      <div class="link-list-scroll">
        <LinkItem
          v-for="(link, i) in linkEntries"
          :key="link.name"
          :link="link"
          :style="{ animationDelay: `${i * 0.15}s` }"
        />
      </div>
    </section>

    <div style="height: 24px" />
  </div>
</template>

<style lang="css" scoped>
.list-area {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
  box-sizing: border-box;
  background-image: url('/background/list-background.jpg');
  background-position: center;
  background-size: cover;

  position: relative;
}

.list-item-container {
  height: auto;
  width: 100%;
  border-top: 2px solid #aaaaaa;
  border-bottom: 2px solid #aaaaaa;
  padding: 20px 0;
  background-color: rgba(0, 0, 0, 0.75);
  overflow-y: auto;
}

.list-item {
  opacity: 0;
  animation: fade-in-right 0.5s ease-in-out forwards;
  animation-delay: var(--delay);
}

.server-options {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  z-index: 1;
}

.server-option {
  width: 12rem;
}

.list-title {
  margin: 0;
  padding: 0 1rem 0.75rem;
  color: #fff;
  font-size: 1.25rem;
  user-select: none;
  text-align: center;
}

.link-list-scroll {
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}
</style>
