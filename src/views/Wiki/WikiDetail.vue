<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { GetGlossaryById, GetItemById, type GlossaryEntry, type ItemEntry } from '@/api/wiki'
import { MdPreview } from 'md-editor-v3'

const props = defineProps<{
  kind: 'glossary' | 'item'
  id: string
}>()

const glossary = ref<GlossaryEntry | null>(null)
const item = ref<ItemEntry | null>(null)
const ready = ref(false)

const galleryImages = computed(() => {
  if (!glossary.value) return []
  try { return JSON.parse(glossary.value.gallery || '[]') as string[] }
  catch { return [] }
})

const recipeSlots = computed(() => {
  if (!item.value) return Array(9).fill('')
  try {
    const arr = JSON.parse(item.value.recipe || '[]') as string[]
    while (arr.length < 9) arr.push('')
    return arr.slice(0, 9)
  } catch { return Array(9).fill('') }
})

onMounted(async () => {
  if (props.kind === 'glossary') {
    glossary.value = await GetGlossaryById(props.id)
  } else {
    item.value = await GetItemById(props.id)
  }
  ready.value = true
})
</script>

<template>
  <div v-if="!ready" class="detail-loading" role="status">
    <img src="/loading.gif" alt="" />
    <span>加载中...</span>
  </div>

  <article v-else class="detail-container">
    <header class="detail-header">
      <h1 class="detail-title">
        <span v-if="glossary">{{ glossary.name }}</span>
        <span v-if="item">{{ item.name }}</span>
      </h1>
      <span v-if="glossary" class="detail-type-tag">{{ glossary.type }}</span>
      <span v-if="item" class="detail-type-tag">{{ item.type }}</span>
    </header>

    <div class="detail-layout">
      <div class="detail-content minecraft-theme">
        <MdPreview
          v-if="glossary"
          :modelValue="glossary.content"
          preview-theme="github"
          class="minecraft-theme"
        />
        <MdPreview
          v-if="item"
          :modelValue="item.content"
          preview-theme="github"
          class="minecraft-theme"
        />
      </div>

      <aside class="detail-sidebar">
        <div v-if="glossary" class="sidebar-section">
          <h3 class="sidebar-title">相册</h3>
          <div v-if="galleryImages.length === 0" class="sidebar-empty">暂无图片</div>
          <div v-else class="gallery-grid">
            <img
              v-for="(img, i) in galleryImages"
              :key="i"
              :src="img"
              :alt="`${glossary.name} 图片 ${i + 1}`"
              class="gallery-image"
            />
          </div>
        </div>

        <div v-if="item" class="sidebar-section">
          <div v-if="item.image" class="item-main-image">
            <img :src="item.image" :alt="item.name" />
          </div>

          <div v-if="item.maxStack" class="item-stat">
            <span class="stat-label">最大堆叠</span>
            <span class="stat-value">×{{ item.maxStack }}</span>
          </div>

          <h3 class="sidebar-title">合成表</h3>
          <div v-if="recipeSlots.every((s) => s === '')" class="sidebar-empty">暂无合成配方</div>
          <div v-else class="recipe-grid">
            <div v-for="(slot, i) in recipeSlots" :key="i" class="recipe-slot">
              <span v-if="slot === ''" class="recipe-empty">-</span>
              <span v-else class="recipe-item-id">{{ slot }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </article>
</template>

<style lang="css" scoped>
.detail-container {
  /* 通过别名复用全局主题变量，随 [data-theme] 自动切换深浅色 */
  --wd-surface: color-mix(in srgb, var(--bg) 68%, transparent);
  --wd-surface-2: var(--bg-scrim);
  --wd-text: var(--text);
  --wd-text-dim: var(--text-muted);
  --wd-text-faint: var(--text-subtle);
  --wd-accent: var(--accent-light);
  --wd-accent-bg: color-mix(in srgb, var(--accent) 15%, transparent);
  --wd-border: var(--border-soft);
  --wd-border-light: var(--border-divider);

  width: min(100%, 72rem);
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--wd-text-dim);
}

.detail-loading img {
  width: 4rem;
  height: 4rem;
  image-rendering: pixelated;
}

.detail-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--wd-border-light);
}

.detail-title {
  margin: 0;
  color: var(--wd-text);
  font-size: 1.8rem;
}

.detail-type-tag {
  padding: 0.15rem 0.6rem;
  color: var(--wd-accent);
  background-color: var(--wd-accent-bg);
  border: 1px solid var(--wd-accent);
  font-size: 0.8rem;
  user-select: none;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20rem;
  gap: 1.5rem;
  align-items: start;
}

.detail-content {
  padding: 1.25rem;
  min-width: 0;
  background-color: var(--wd-surface);
  border: 2px solid var(--wd-border);
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  padding: 1rem;
  background-color: var(--wd-surface);
  border: 2px solid var(--wd-border);
}

.sidebar-title {
  margin: 0 0 0.75rem;
  color: var(--wd-text);
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--wd-border-light);
}

.sidebar-empty {
  color: var(--wd-text-faint);
  font-size: 0.9rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.gallery-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  border: 1px solid var(--border-light);
  background-color: var(--bg-thumb);
  image-rendering: pixelated;
}

.item-main-image {
  width: 100%;
  max-width: 10rem;
  margin: 0 auto 1rem;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-overlay-soft);
  border: 2px solid var(--border-light);
  box-shadow:
    inset -2px -2px 0 0 var(--border),
    inset 2px 2px 0 0 var(--border-light);
}

.item-main-image img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-soft-2);
}

.stat-label {
  color: color-mix(in srgb, var(--text) 70%, transparent);
  font-size: 0.9rem;
}

.stat-value {
  color: var(--wd-text);
  font-weight: bold;
  font-size: 1.1rem;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background-color: var(--mc-slot-bg);
  border: 2px solid var(--mc-slot-bg);
}

.recipe-slot {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mc-slot);
  border-top: 2px solid var(--mc-slot-border-dark);
  border-left: 2px solid var(--mc-slot-border-dark);
  border-bottom: 2px solid var(--mc-slot-border-light);
  border-right: 2px solid var(--mc-slot-border-light);
  font-size: 0.7rem;
  color: var(--mc-btn-text);
  overflow: hidden;
}

.recipe-item-id {
  font-size: 0.65rem;
  word-break: break-all;
  text-align: center;
  line-height: 1.1;
}

.recipe-empty {
  color: var(--mc-slot-bg);
  font-size: 1rem;
  user-select: none;
}

@media screen and (max-width: 860px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}

@media screen and (max-width: 500px) {
  .detail-sidebar { grid-template-columns: 1fr; }
}
</style>
