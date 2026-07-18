<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GetGlossaryById, GetItemById, type GlossaryEntry, type ItemEntry } from '@/api/wiki'
import { MdPreview } from 'md-editor-v3'
import MinecraftButtonClassic from '@/components/utils/MinecraftButtonClassic.vue'

const route = useRoute()
const router = useRouter()

const kind = computed(() => route.params.kind as 'glossary' | 'item')
const id = computed(() => route.params.id as string)

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
    const slots = Array(9).fill('')
    for (let i = 0; i < Math.min(arr.length, 9); i++) slots[i] = typeof arr[i] === 'string' ? arr[i] : ''
    return slots
  } catch { return Array(9).fill('') }
})

onMounted(async () => {
  if (kind.value === 'glossary') {
    glossary.value = await GetGlossaryById(id.value)
  } else {
    item.value = await GetItemById(id.value)
  }
  ready.value = true
})
</script>

<template>
  <div class="detail-page">
    <div class="detail-topbar">
      <MinecraftButtonClassic class="detail-back" @click="router.push('/wiki')">
        ← 返回百科
      </MinecraftButtonClassic>
    </div>

    <div v-if="!ready" class="detail-loading" role="status">
      <img src="/loading.gif" alt="" />
      <span>加载中...</span>
    </div>

    <article v-else class="detail-main">
      <header class="detail-header">
        <h1 class="detail-title">
          <span v-if="glossary">{{ glossary.name }}</span>
          <span v-if="item">{{ item.name }}</span>
        </h1>
        <span class="detail-type-tag">
          {{ glossary ? glossary.type : item?.type || '' }}
        </span>
      </header>

      <div class="detail-body">
        <div class="detail-text minecraft-theme">
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

        <aside class="detail-side">
          <div v-if="glossary" class="side-block">
            <h3 class="side-title">相册</h3>
            <div v-if="galleryImages.length === 0" class="side-empty">暂无图片</div>
            <div v-else class="gallery-list">
              <img
                v-for="(img, i) in galleryImages"
                :key="i"
                :src="img"
                :alt="`${glossary.name} 图${i + 1}`"
                class="gallery-img"
              />
            </div>
          </div>

          <div v-if="item" class="side-block">
            <div v-if="item.image" class="item-img-wrap">
              <img :src="item.image" :alt="item.name" class="item-img" />
            </div>

            <div class="item-stat">
              <span class="stat-label">最大堆叠</span>
              <span class="stat-value">×{{ item.maxStack }}</span>
            </div>

            <h3 class="side-title">合成表</h3>
            <div v-if="recipeSlots.every((s) => s === '')" class="side-empty">暂无配方</div>
            <div v-else class="recipe-grid">
              <div
                v-for="(slot, i) in recipeSlots"
                :key="i"
                class="recipe-cell"
              >
                <span v-if="slot === ''" class="recipe-placeholder"></span>
                <span v-else class="recipe-id">{{ slot }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<style lang="css" scoped>
.detail-page {
  --w-bg: #ffffff;
  --w-surface: rgba(255, 255, 255, 0.92);
  --w-surface-2: rgba(255, 255, 255, 0.85);
  --w-cream: #ffffff;
  --w-text: #3a3028;
  --w-text-muted: #7a6e5e;
  --w-text-dim: #8a7e6e;
  --w-accent: #5a7a3a;
  --w-accent-bg: rgba(90, 122, 58, 0.12);
  --w-border: #67C23A;
  --w-shadow: rgba(0, 0, 0, 0.06);

  min-height: 100vh;
  background: var(--w-bg);
  color: var(--w-text);
  padding-bottom: 3rem;
}



.detail-topbar {
  width: 100%;
  padding: 1rem clamp(1rem, 5vw, 3rem);
  background-color: var(--w-surface);
  border-bottom: 2px solid var(--w-border);
}

.detail-back {
  width: 8rem;
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--w-text-dim);
}

.detail-loading img {
  width: 4rem;
  height: 4rem;
}

.detail-main {
  width: 80%;
  margin: 2rem auto 0;
  min-width: 0;
}

.detail-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--w-border);
}

.detail-title {
  margin: 0;
  color: var(--w-text);
  font-size: 1.8rem;
}

.detail-type-tag {
  padding: 0.15rem 0.6rem;
  color: var(--w-accent);
  background-color: var(--w-accent-bg);
  border: 1px solid var(--w-accent);
  font-size: 0.85rem;
  user-select: none;
}

.detail-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24rem;
  gap: 1rem;
  align-items: start;
}

.detail-text {
  padding: 1.5rem;
  background-color: var(--w-surface-2);
  border: 2px solid var(--w-border);
  box-shadow: 0 2px 8px var(--w-shadow);
  min-width: 0;
  color: var(--w-text);
}

.detail-side {
  display: flex;
  flex-direction: column;
  gap: 1.0rem;
}

.side-block {
  padding: 1rem;
  background-color: var(--w-surface-2);
  border: 2px solid var(--w-border);
  box-shadow: 0 2px 8px var(--w-shadow);
}

.side-title {
  margin: 0 0 0.75rem;
  color: var(--w-accent);
  font-size: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--w-border);
}

.side-empty {
  color: #a09888;
  font-size: 0.9rem;
}

.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  border: 1px solid var(--w-border);
  background-color: var(--w-cream);
}

.item-img-wrap {
  width: 100%;
  max-width: 8rem;
  margin: 0 auto 1rem;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--w-cream);
  border: 2px solid #c4b898;
  box-shadow: inset 2px 2px 0 0 rgba(255,255,255,0.6), inset -2px -2px 0 0 rgba(0,0,0,0.12);
}

.item-img {
  width: 75%;
  height: 75%;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--w-border);
}

.stat-label { color: var(--w-text-dim); font-size: 0.9rem; }
.stat-value { color: var(--w-text); font-weight: bold; font-size: 1.1rem; }

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background-color: #555;
  border: 2px solid #555;
  aspect-ratio: 1;
}

.recipe-cell {
  background-color: #8b8b8b;
  border-top: 3px solid #373737;
  border-left: 3px solid #373737;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  overflow: hidden;
}

.recipe-id {
  font-size: 0.9rem;
  color: #ffffff;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}

.recipe-placeholder {
  display: block;
}

@media screen and (max-width: 960px) {
  .detail-main { width: 88%; }
  .detail-body { grid-template-columns: 1fr; }
  .detail-side { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
}

@media screen and (max-width: 500px) {
  .detail-main { width: 94%; }
  .detail-side { grid-template-columns: 1fr; }
}
</style>

<style lang="css">
.detail-page .minecraft-theme {
  --text: var(--w-text, #3a3028);
  --area: var(--w-cream, #ecf8f5);
  --border: var(--w-border, #d4c8b0);
  --border-blue: var(--w-accent, #5a7a3a);
  background-color: transparent;
  color: var(--w-text, #3a3028);
}

.detail-page .minecraft-theme a { color: var(--w-accent, #5a7a3a); }
.detail-page .minecraft-theme a:hover { color: #7a5a2a; }
.detail-page .minecraft-theme a:after { border-color: var(--w-accent, #5a7a3a); }
.detail-page .minecraft-theme code {
  background-color: #fbfbfb;
  color: #5a3030;
  text-shadow: none;
}
.detail-page .minecraft-theme strong { color: var(--w-text, #3a3028); }
.detail-page .minecraft-theme h1, .detail-page .minecraft-theme h2,
.detail-page .minecraft-theme h3, .detail-page .minecraft-theme h4 { color: var(--w-text, #3a3028); }
.detail-page .minecraft-theme blockquote {
  color: var(--w-text, #3a3028);
  background: #ffffff;
  border-left-color: var(--w-accent, #5a7a3a);
  border-color: var(--w-border, #ffffff);
  border-image: none;
}
.detail-page .minecraft-theme ol li::marker,
.detail-page .minecraft-theme ul li::marker { color: var(--w-accent, #5a7a3a); }
</style>
