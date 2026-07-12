<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { GetServerList, type ServerEntity } from '../../api/serverlist'
import { GetLinkEntries, type LinkEntry } from '@/api/links'
import useClipboard from 'vue-clipboard3'
import ListItem from './ListItem.vue'
import MinecraftButtonClassic from '@/components/utils/MinecraftButtonClassic.vue'
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
    <div class="list-item-container">
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
    </div>
    <div class="server-options">
      <MinecraftButtonClassic class="server-option" @click="refresh">刷新</MinecraftButtonClassic>
      <MinecraftButtonClassic
        class="server-option"
        @click="
          focusIndex !== -1
            ? copy(serverList[focusIndex].serverUrl || 'undefined')
            : toast.warning('未选择服务器！')
        "
        >加入服务器</MinecraftButtonClassic
      >
    </div>

    <section class="link-container" aria-labelledby="link-section-title">
      <h2 id="link-section-title" class="link-section-title">友情链接</h2>
      <div class="link-list-scroll">
        <a
          v-for="(link, i) in linkEntries"
          :key="link.name"
          class="link-card"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :style="{ animationDelay: `${i * 0.15}s` }"
        >
          <div class="link-item-border">
            <div class="link-icon-area">
              <img :src="link.icon" :alt="`${link.name} 图标`" />
            </div>
            <div class="link-item-info">
              <span class="link-item-name">{{ link.name }}</span>
              <span class="link-item-desc">{{ link.description }}</span>
            </div>
            <div class="link-item-meta">
              <span class="link-item-arrow" aria-hidden="true">▶</span>
            </div>
          </div>
        </a>
      </div>
    </section>
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
  height: 72vh;
  width: 100%;
  border-top: 4px solid #eeeeee;
  border-bottom: 4px solid #eeeeee;
  padding: 20px 0;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
}

.list-area::before {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.2);
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

.link-container {
  width: 100%;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 1rem 0;
  z-index: 1;
  margin-top: 3rem;
}

.link-section-title {
  margin: 0;
  padding: 0 1rem 0.75rem;
  color: #fff;
  font-size: 1.2rem;
  user-select: none;
  text-align: center;
}

.link-list-scroll {
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.link-card {
  width: 100%;
  max-width: 768px;
  min-width: 20rem;
  margin: 0 auto;
  color: inherit;
  text-decoration: none;

  opacity: 0;
  animation: fade-in-right 0.5s ease-in-out forwards;
}

.link-item-border {
  position: relative;
  width: 100%;
  padding: 2px 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 20rem;
  background-size: 100% auto;
  border: 2px solid transparent;
  box-sizing: border-box;
}

.link-card:hover .link-item-border,
.link-card:focus-visible .link-item-border {
  background-color: black;
  border: 2px solid white;
}

.link-card:focus-visible {
  outline: none;
}

.link-icon-area {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon-area img {
  width: 60px;
  height: 60px;
  border: 1px solid grey;
  image-rendering: pixelated;
  user-select: none;
}

.link-card:hover .link-icon-area::after {
  pointer-events: none;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  background: url('/UI/Arrow_Right.png') no-repeat center;
  background-size: 22px 34px;
  image-rendering: pixelated;
  z-index: 256;
}

.link-card:hover .link-icon-area::before {
  pointer-events: none;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  background: rgba(128, 128, 128, 0.7);
  z-index: 128;
}

.link-card:focus-visible .link-icon-area::after {
  pointer-events: none;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  background: url('/UI/Arrow_Right.png') no-repeat center;
  background-size: 22px 34px;
  image-rendering: pixelated;
  z-index: 256;
}

.link-card:focus-visible .link-icon-area::before {
  pointer-events: none;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  background: rgba(128, 128, 128, 0.7);
  z-index: 128;
}

.link-item-info {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  min-width: 0;
}

.link-item-name {
  color: white;
  line-height: 1.1rem;
  font-size: 1.1rem;
  margin-bottom: 5px;
  margin-top: 4px;
  user-select: none;
}

.link-item-desc {
  line-height: 1rem;
  user-select: none;
  color: rgba(255, 255, 255, 0.72);
}

.link-item-meta {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 0.5rem;
}

.link-item-arrow {
  color: #aaaaaa;
  font-size: 0.9rem;
  user-select: none;
}

@media screen and (max-width: 768px) {
  .link-card {
    min-width: 0;
  }

  .link-item-border {
    min-width: 0;
  }
}
</style>
