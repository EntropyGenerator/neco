<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

import ThemePalette from '@/components/ThemePalette.vue'
import { useLantern } from '@/lantern/lantern'

useLantern('lantern-wrapper', {
  position: {
    zIndex: 8,
    offsetX: ['5%', '20%', '20%', '5%'],
  },
})

const soundOn = () => {
  const audio = new Audio('/button.click.ogg')
  audio.volume = 0.3
  audio.play().catch(() => {})
}

const router = useRouter()
const navFolded = ref(false)

const onResize = () => {
  if (window.innerWidth >= 641 && navFolded.value) {
    navFolded.value = false
  }
}

interface NavItem {
  name: string
  url: string
}

const navItems = ref<NavItem[]>([
  { name: '主页', url: '/lobby' },
  { name: '维度', url: '/list' },
  { name: '活动', url: '/activity' },
  { name: '新闻', url: '/news' },
  { name: '关于', url: '/about' },
  { name: '文档', url: '/documents' },
  { name: '百科', url: '/wiki' },
])
const activeIndex = ref<number>(0)

const sliderStyle = computed(() => {
  return {
    width: `${100 / navItems.value.length}%`,
    transform: `translateX(${activeIndex.value * 100}%)`,
    transition: 'transform 0.5s ease',
  }
})

const showLantern = ref(true)

onBeforeRouteUpdate((to) => {
  const path = '/' + to.path.split('/')[1]
  navItems.value.forEach((item, index) => {
    if (item.url === path) {
      activeIndex.value = index
    }
  })
  if (['/documents', '/news', '/list', '/wiki'].includes(path)) {
    showLantern.value = false
  } else {
    showLantern.value = true
  }
})

onMounted(() => {
  const path = '/' + router.currentRoute.value.path.split('/')[1]
  navItems.value.forEach((item, index) => {
    if (item.url === path) {
      activeIndex.value = index
    }
  })
  if (['/documents', '/news', '/list', '/wiki'].includes(path)) {
    showLantern.value = false
  } else {
    showLantern.value = true
  }

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    :style="{
      opacity: showLantern ? 1 : 0,
    }"
    id="lantern-wrapper"
  ></div>
  <div class="nav-container">
    <div class="nav-controls">
      <button
        type="button"
        class="nav-fold-btn"
        :aria-expanded="!navFolded"
        aria-controls="site-nav"
        aria-label="展开或收起导航栏"
        @click="(navFolded = !navFolded), soundOn()"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="nav-fold-text">菜单</span>
      </button>

      <ThemePalette />
    </div>

    <nav id="site-nav" class="nav-bar" :type="navFolded ? 'fold' : undefined">
      <RouterLink
        v-for="(item, index) in navItems"
        :key="item.url"
        class="nav-item mcfont"
        :to="item.url"
        :aria-current="activeIndex === index ? 'page' : undefined"
        @click="soundOn"
      >
        {{ item.name }}
      </RouterLink>

      <div class="slider" :style="sliderStyle">
        <div class="slider-box"></div>
      </div>
    </nav>
  </div>
</template>

<style lang="css" scoped>
#lantern-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 5vh;
  transition: opacity 0.3s ease-in-out;
}

.nav-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0.5rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: max-content;
  gap: 0.5rem;
  user-select: none;
  z-index: 1024;
}

.nav-bar {
  height: calc(1rem + 28px);
  display: flex;
  border-radius: 0;
  background-color: var(--bg-overlay);
  border: 2px solid var(--border-strong);
  position: relative;
  box-shadow: 4px 4px var(--shadow-strong);
  transition: all 0.3s ease-in-out;
  opacity: 1;
  overflow: hidden;
}

.nav-bar[type='fold'] {
  height: 0;
  opacity: 0;
}

/* 浅色方案：导航栏仍为深色遮罩底，导航文字与焦点环保持浅色以保证可读 */
[data-theme='light'] .nav-bar {
  color: var(--text-inverse);
}

[data-theme='light'] .nav-item:focus-visible {
  outline-color: var(--text-inverse);
}

.nav-item {
  color: inherit;
  text-decoration: none;
  position: relative;
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;
  font-size: 1rem;
}

.nav-item:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: -3px;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 0;
  box-sizing: border-box;
  padding: 4px;
}

.slider-box {
  box-sizing: border-box;
  background-color: var(--nav-slider);
  border-radius: 0;
  border-top: 4px solid var(--nav-slider-light);
  border-bottom: 4px solid var(--nav-slider-dark);
  height: 100%;
  width: 100%;

  box-shadow: 2px 2px var(--shadow);
}

/* 控制行：桌面端固定右上角（只显示调色盘）；移动端内联于导航上方居中 */
.nav-controls {
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1025;
}

.nav-fold-btn {
  display: none;
  height: 2.75rem;
  padding: 0 0.9rem;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
  background-color: var(--bg-card);
  border: 2px solid var(--border-strong);
  box-shadow: 4px 4px var(--shadow-strong);
}

.nav-fold-btn:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

@media screen and (max-width: 640px) {
  .nav-container {
    gap: 0.35rem;
  }

  .nav-controls {
    position: static;
    justify-content: center;
  }

  .nav-fold-btn {
    display: flex;
  }

  .nav-item {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
}
</style>
