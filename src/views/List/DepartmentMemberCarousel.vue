<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { DepartmentMember } from '@/api/department'
import DepartmentMemberCard from './DepartmentMemberCard.vue'

const props = defineProps<{
  members: DepartmentMember[]
}>()

const trackRef = ref<HTMLElement | null>(null)
const activePage = ref(0)
const pageCount = ref(1)

const hasMembers = computed(() => props.members.length > 0)

const updatePageCount = () => {
  const track = trackRef.value
  if (!track) {
    pageCount.value = 1
    return
  }

  const slide = track.querySelector<HTMLElement>('.member-slide')
  const pageUnit =
    slide?.offsetWidth || track.querySelector<HTMLElement>('.member-card')?.offsetWidth || 1
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14
  const visibleCount = Math.max(1, Math.floor((track.clientWidth + gap) / (pageUnit + gap)))
  pageCount.value = Math.max(1, Math.ceil(props.members.length / visibleCount))
}

const onScroll = () => {
  const track = trackRef.value
  if (!track || pageCount.value <= 1) {
    activePage.value = 0
    return
  }

  const slide = track.querySelector<HTMLElement>('.member-slide')
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14
  const pageUnit = slide?.offsetWidth || 1
  const pageWidth = pageUnit + gap
  activePage.value = Math.min(
    pageCount.value - 1,
    Math.round(track.scrollLeft / Math.max(pageWidth, 1)),
  )
}

const scrollToPage = (page: number) => {
  const track = trackRef.value
  if (!track) return

  const slide = track.querySelector<HTMLElement>('.member-slide')
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14
  const pageUnit = slide?.offsetWidth || 1
  const pageWidth = pageUnit + gap
  const target = page * pageWidth

  track.scrollTo({
    left: target,
    behavior: 'smooth',
  })
  activePage.value = page
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  updatePageCount()
  resizeObserver = new ResizeObserver(updatePageCount)
  if (trackRef.value) resizeObserver.observe(trackRef.value)
  window.addEventListener('resize', updatePageCount)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updatePageCount)
})

watch(
  () => props.members,
  () => {
    activePage.value = 0
    requestAnimationFrame(updatePageCount)
  },
  { deep: true },
)
</script>

<template>
  <section class="member-carousel" aria-label="部门成员列表">
    <div v-if="!hasMembers" class="member-empty">暂无成员信息</div>

    <div v-else ref="trackRef" class="member-track" tabindex="0" @scroll.passive="onScroll">
      <div v-for="member in members" :key="member.username" class="member-slide">
        <DepartmentMemberCard :member="member" />
      </div>
    </div>

    <div
      v-if="hasMembers && pageCount > 1"
      class="member-dots"
      role="tablist"
      aria-label="成员分页"
    >
      <button
        v-for="page in pageCount"
        :key="page"
        type="button"
        class="member-dot"
        :class="{ active: activePage === page - 1 }"
        :aria-label="`第 ${page} 页`"
        :aria-selected="activePage === page - 1"
        role="tab"
        @click="scrollToPage(page - 1)"
      />
    </div>
  </section>
</template>

<style scoped>
.member-carousel {
  --member-card-max-size: 9.25rem;
  --member-card-size: var(--member-card-max-size);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.85rem;
  min-width: 0;
  width: 100%;
}

.member-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.85rem;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0.2rem 0.2rem 0.4rem 0;
  -webkit-overflow-scrolling: touch;
}

.member-track:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 4px;
}

.member-track > .member-slide {
  flex: 0 0 auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  scroll-snap-align: start;
}

@media screen and (max-width: 640px) {
  .member-track {
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 0;
  }
}

.member-dots {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
}

.member-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: color-mix(in srgb, var(--text) 35%, transparent);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.member-dot.active {
  background: var(--text);
  transform: scale(1.15);
}

.member-dot:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}

.member-empty {
  min-height: 8.5rem;
  display: grid;
  place-items: center;
  color: var(--text-muted);
  background: color-mix(in srgb, var(--bg-sunken) 18%, transparent);
  border: 2px dashed var(--text-gray);
}
</style>
