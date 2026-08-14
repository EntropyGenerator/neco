<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const THEME_KEY = 'nmo-theme'
const ACCENT_KEY = 'nmo-accent'

const ACCENTS = [
  { id: 'green', label: '翠绿', color: '#3c8527' },
  { id: 'red', label: '红石', color: '#b02e26' },
  { id: 'blue', label: '青金石', color: '#3c44aa' },
  { id: 'gold', label: '黄金', color: '#c8a03a' },
  { id: 'purple', label: '紫水晶', color: '#8932b8' },
  { id: 'cyan', label: '海晶', color: '#169c9c' },
] as const

type AccentId = (typeof ACCENTS)[number]['id']

const open = ref(false)
const scheme = ref<'dark' | 'light'>('dark')
const accent = ref<AccentId>('green')

const soundOn = () => {
  const audio = new Audio('/button.click.ogg')
  audio.volume = 0.3
  audio.play().catch(() => {})
}

const applyScheme = (value: 'dark' | 'light') => {
  scheme.value = value
  if (value === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  localStorage.setItem(THEME_KEY, value)
}

const applyAccent = (value: AccentId) => {
  accent.value = value
  if (value === 'green') {
    document.documentElement.removeAttribute('data-accent')
  } else {
    document.documentElement.setAttribute('data-accent', value)
  }
  localStorage.setItem(ACCENT_KEY, value)
}

const toggle = () => {
  open.value = !open.value
  soundOn()
}

const onDocumentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.palette')) {
    open.value = false
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  const savedScheme = localStorage.getItem(THEME_KEY)
  if (savedScheme === 'light' || savedScheme === 'dark') {
    applyScheme(savedScheme)
  }
  const savedAccent = localStorage.getItem(ACCENT_KEY)
  if (savedAccent && ACCENTS.some((a) => a.id === savedAccent)) {
    applyAccent(savedAccent as AccentId)
  }
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="palette">
    <button
      type="button"
      class="palette-toggle"
      :aria-expanded="open"
      aria-label="主题设置"
      @click="toggle"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M12 22a10 10 0 1 1 10-10c0 1.16-.84 2-2 2h-2.51c-1.04 0-1.88.84-1.88 1.88 0 .55.24 1.03.58 1.37.36.36.57.85.57 1.38 0 1.16-.94 2.08-2.08 2.08H12z"
        />
        <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="17" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </button>

    <div v-if="open" class="palette-panel" role="group" aria-label="主题设置">
      <div class="palette-section">
        <span class="palette-label">配色方案</span>
        <div class="palette-schemes">
          <button
            type="button"
            class="palette-option"
            :class="{ active: scheme === 'dark' }"
            @click="applyScheme('dark')"
          >
            深色
          </button>
          <button
            type="button"
            class="palette-option"
            :class="{ active: scheme === 'light' }"
            @click="applyScheme('light')"
          >
            浅色
          </button>
        </div>
      </div>

      <div class="palette-section">
        <span class="palette-label">主题色</span>
        <div class="palette-swatches">
          <button
            v-for="item in ACCENTS"
            :key="item.id"
            type="button"
            class="palette-swatch"
            :class="{ active: accent === item.id }"
            :style="{ '--swatch': item.color }"
            :aria-label="item.label"
            :title="item.label"
            @click="applyAccent(item.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.palette {
  position: relative;
  user-select: none;
}

.palette-toggle {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
  color: var(--text);
  background-color: var(--bg-card);
  border: 2px solid var(--border-strong);
  box-shadow: 4px 4px var(--shadow-strong);
}

.palette-toggle:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

.palette-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 14rem;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-sizing: border-box;
  background-color: var(--bg-card);
  border: 2px solid var(--border-strong);
  box-shadow: 4px 4px var(--shadow-strong);
  z-index: 1026;
}

.palette-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palette-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  user-select: none;
}

.palette-schemes {
  display: flex;
  gap: 0.5rem;
}

.palette-option {
  flex: 1;
  padding: 0.6rem 0;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
  background-color: var(--bg-surface);
  border: 2px solid var(--border);
}

.palette-option.active {
  color: var(--accent-bright);
  background-color: var(--accent-soft);
  border-color: var(--accent-light);
}

.palette-option:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.palette-swatches {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.palette-swatch {
  aspect-ratio: 1;
  padding: 0;
  cursor: pointer;
  background-color: var(--swatch);
  border: 2px solid var(--border);
}

.palette-swatch.active {
  outline: 3px solid var(--accent-light);
  outline-offset: 2px;
}

.palette-swatch:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

@media screen and (max-width: 640px) {
  .palette-panel {
    width: 12.5rem;
  }
}
</style>
