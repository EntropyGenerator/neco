<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GetGlossaryList, GetItemList, type GlossaryEntry, type ItemEntry } from '@/api/wiki'

const router = useRouter()

const GLOSSARY_TYPES = ['服务器', '社群', '概念', '地理' ,'其它']
const ITEM_TYPES = ['工具', '武器', '防具', '食物', '方块', '装饰品', '杂项', '其它']

const activeTab = ref<'glossary' | 'item'>('glossary')
const glossaryList = ref<GlossaryEntry[]>([])
const itemList = ref<ItemEntry[]>([])
const ready = ref(false)

const searchQuery = ref('')
const activeTypeFilters = ref<Set<string>>(new Set())

const groupedGlossary = ref<Record<string, GlossaryEntry[]>>({})
const groupedItems = ref<Record<string, ItemEntry[]>>({})

const availableTypes = computed(() => {
  return activeTab.value === 'glossary' ? GLOSSARY_TYPES : ITEM_TYPES
})

const groupByType = <T extends { type: string }>(list: T[]) => {
  const groups: Record<string, T[]> = {}
  for (const entry of list) {
    const key = entry.type || '未分类'
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
}

const fuzzyMatch = (text: string, query: string) => {
  if (!query.trim()) return true
  return text.toLowerCase().includes(query.toLowerCase().trim())
}

const filteredGroups = computed(() => {
  const groups = activeTab.value === 'glossary' ? groupedGlossary.value : groupedItems.value
  const query = searchQuery.value

  const result: Record<string, (GlossaryEntry | ItemEntry)[]> = {}
  for (const [typeName, entries] of Object.entries(groups)) {
    if (activeTypeFilters.value.size > 0 && !activeTypeFilters.value.has(typeName)) {
      continue
    }
    const filtered = entries.filter((e: GlossaryEntry | ItemEntry) => fuzzyMatch(e.name, query))
    if (filtered.length > 0) {
      result[typeName] = filtered
    }
  }
  return result
})

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || activeTypeFilters.value.size > 0
})

const toggleTypeFilter = (type: string) => {
  const next = new Set(activeTypeFilters.value)
  if (next.has(type)) {
    next.delete(type)
  } else {
    next.add(type)
  }
  activeTypeFilters.value = next
}

const clearFilters = () => {
  searchQuery.value = ''
  activeTypeFilters.value = new Set()
}

const openDetail = (kind: 'glossary' | 'item', id: string) => {
  router.push(`/wiki/detail/${kind}/${id}`)
}

const galleryThumb = (entry: GlossaryEntry) => {
  try {
    const arr = JSON.parse(entry.gallery || '[]') as string[]
    return arr[0] || ''
  } catch {
    return ''
  }
}

watch(activeTab, () => {
  searchQuery.value = ''
  activeTypeFilters.value = new Set()
})

onMounted(async () => {
  glossaryList.value = await GetGlossaryList()
  itemList.value = await GetItemList()
  groupedGlossary.value = groupByType(glossaryList.value)
  groupedItems.value = groupByType(itemList.value)
  ready.value = true
})
</script>

<template>
  <div class="wiki-page">
    <section class="wiki-hero" aria-labelledby="wiki-hero-title">
      <h1 id="wiki-hero-title" class="wiki-hero-title mcfont">百科</h1>
      <p class="wiki-hero-desc">NMO Minecraft 游戏知识库</p>
    </section>

    <div class="wiki-tabs">
      <button
        :class="['wiki-tab', { active: activeTab === 'glossary' }]"
        @click="activeTab = 'glossary'"
      >
        词条百科
      </button>
      <button
        :class="['wiki-tab', { active: activeTab === 'item' }]"
        @click="activeTab = 'item'"
      >
        物品百科
      </button>
    </div>

    <div class="wiki-filters">
      <div class="wiki-search-row">
        <input
          class="wiki-search-input"
          type="text"
          v-model="searchQuery"
          placeholder="搜索名称..."
        />
        <button
          v-if="hasActiveFilters"
          class="wiki-clear-btn"
          @click="clearFilters"
        >
          清除筛选
        </button>
      </div>

      <div class="wiki-type-filters">
        <button
          v-for="t in availableTypes"
          :key="t"
          :class="['wiki-type-pill', { active: activeTypeFilters.has(t) }]"
          @click="toggleTypeFilter(t)"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div v-if="!ready" class="wiki-loading" role="status">
      <img src="/loading.gif" alt="" />
      <span>正在加载百科内容...</span>
    </div>

    <template v-else>
      <div v-if="Object.keys(filteredGroups).length === 0" class="wiki-no-result">
        <span>没有找到匹配的{{ activeTab === 'glossary' ? '词条' : '物品' }}</span>
      </div>

      <template v-else>
        <section class="wiki-categories">
          <div
            v-for="(entries, groupName) in filteredGroups"
            :key="groupName"
            class="wiki-category"
          >
            <h2 class="wiki-category-title">{{ groupName }}</h2>
            <div class="wiki-grid">
              <button
                v-for="entry in entries"
                :key="entry.id"
                class="wiki-card"
                @click="openDetail(activeTab, entry.id)"
              >
                <div class="wiki-card-img">
                  <img
                    v-if="activeTab === 'glossary' && galleryThumb(entry as GlossaryEntry)"
                    :src="galleryThumb(entry as GlossaryEntry)"
                    :alt="entry.name"
                  />
                  <img
                    v-else-if="activeTab === 'item' && (entry as ItemEntry).image"
                    :src="(entry as ItemEntry).image"
                    :alt="entry.name"
                  />
                  <span v-else class="wiki-card-placeholder">?</span>
                </div>
                <p class="wiki-card-name">{{ entry.name }}</p>
              </button>
            </div>
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<style lang="css" scoped>
.wiki-page {
  --w-bg: #e3e3e3;
  --w-bg-end: #bcbcbc;
  --w-surface: rgba(255, 255, 255, 0.92);
  --w-surface-2: rgba(255, 255, 255, 0.85);
  --w-surface-3: rgba(255, 255, 255, 0.7);
  --w-cream: #ffffff;
  --w-text: #000000;
  --w-text-muted: #7a6e5e;
  --w-text-dim: #8a7e6e;
  --w-accent: #5a7a3a;
  --w-accent-bg: rgba(90, 122, 58, 0.15);
  --w-border: #ffffff;
  --w-shadow: rgba(0, 0, 0, 0.06);
  --w-placeholder: #b0a898;
  --w-placeholder-icon: #c4b898;

  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 5rem clamp(1rem, 4vw, 3rem) 3rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, var(--w-bg) 0%, var(--w-bg-end) 100%);
  color: var(--w-text);
}

.wiki-hero {
  width: min(100%, 72rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background-color: var(--w-surface);
  border: 2px solid var(--w-border);
  box-shadow: 0 2px 12px var(--w-shadow);
}

.wiki-hero-title {
  margin: 0 0 0.35rem;
  color: var(--w-text);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.2;
}

.wiki-hero-desc {
  margin: 0;
  color: var(--w-text-muted);
  font-size: 1rem;
}

.wiki-tabs {
  display: flex;
  gap: 0.5rem;
}

.wiki-tab {
  padding: 0.6rem 1.5rem;
  color: var(--w-text-muted);
  background-color: var(--w-surface-3);
  border: 2px solid var(--w-border);
  font: inherit;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.wiki-tab:hover {
  border-color: var(--w-accent);
  color: var(--w-text);
  background-color: rgba(255, 255, 255, 0.95);
}

.wiki-tab.active {
  color: var(--w-accent);
  background-color: rgba(255, 255, 255, 0.95);
  border-color: var(--w-accent);
}

.wiki-tab:focus-visible {
  outline: 3px solid var(--w-accent);
  outline-offset: 3px;
}

.wiki-filters {
  width: min(100%, 72rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.wiki-search-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.wiki-search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--w-border);
  background-color: var(--w-surface);
  color: var(--w-text);
  font: inherit;
  font-size: 1rem;
  outline: none;
  letter-spacing: 1px;
}

.wiki-search-input::placeholder {
  color: var(--w-placeholder);
}

.wiki-search-input:focus {
  border-color: var(--w-accent);
}

.wiki-clear-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #c4a898;
  background-color: var(--w-surface-2);
  color: var(--w-text-dim);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.wiki-clear-btn:hover {
  border-color: #a08070;
  color: #5a3030;
}

.wiki-type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.wiki-type-pill {
  padding: 0.3rem 0.75rem;
  border: 2px solid var(--w-border);
  background-color: var(--w-surface-3);
  color: var(--w-text-muted);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.wiki-type-pill:hover {
  border-color: var(--w-accent);
  color: var(--w-text);
}

.wiki-type-pill.active {
  background-color: var(--w-accent-bg);
  border-color: var(--w-accent);
  color: var(--w-accent);
}

.wiki-type-pill:focus-visible {
  outline: 2px solid var(--w-accent);
  outline-offset: 2px;
}

.wiki-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--w-text-muted);
  font-size: 1.1rem;
}

.wiki-loading img {
  width: 5rem;
  height: 5rem;
  image-rendering: pixelated;
}

.wiki-no-result {
  padding: 2rem;
  color: var(--w-text-dim);
  font-size: 1rem;
}

.wiki-categories {
  width: min(100%, 72rem);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.wiki-category-title {
  margin: 0 0 1rem;
  padding-left: 0.75rem;
  color: var(--w-text);
  font-size: 1.3rem;
  border-left: 4px solid var(--w-accent);
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.75rem;
}

.wiki-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--w-surface);
  border: 2px solid var(--w-border);
  box-shadow:
    inset -1px -1px 0 0 var(--w-shadow),
    inset 1px 1px 0 0 rgba(255, 255, 255, 0.8),
    0 0.25rem 0.5rem var(--w-shadow);
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.15s ease;
}

.wiki-card:hover {
  border-color: var(--w-accent);
  transform: translateY(-2px);
}

.wiki-card:focus-visible {
  outline: 3px solid var(--w-accent);
  outline-offset: 3px;
}

.wiki-card-img {
  width: 9rem;
  height: 9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--w-cream);
  border: 2px solid var(--w-border);
}

.wiki-card-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  user-select: none;
}

.wiki-card-placeholder {
  font-size: 1.5rem;
  color: var(--w-placeholder-icon);
  user-select: none;
}

.wiki-card-name {
  margin: 0;
  font-size: 0.85rem;
  color: var(--w-text);
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.wiki-card-stack {
  position: absolute;
  top: 0.25rem;
  right: 0.35rem;
  font-size: 0.75rem;
  color: var(--w-accent);
  font-weight: bold;
}

@media screen and (max-width: 600px) {
  .wiki-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .wiki-card-img {
    width: 3.5rem;
    height: 3.5rem;
  }

  .wiki-card-name {
    font-size: 0.75rem;
  }

  .wiki-search-row {
    flex-direction: column;
  }

  .wiki-clear-btn {
    width: 100%;
  }
}
</style>
