<script lang="ts" setup>
import { computed } from 'vue'
import type { DepartmentMember } from '@/api/department'
import { getMemberAvatar, getMemberTitle } from '@/api/department'

const props = defineProps<{
  member: DepartmentMember
}>()

const avatarUrl = computed(() => getMemberAvatar(props.member))
const memberTitle = computed(() => getMemberTitle(props.member))

const onAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/nmo-logo-large.png'
}
</script>

<template>
  <article
    class="member-card"
    :class="{ leader: member.isLeader }"
    tabindex="0"
    :aria-label="`${member.username}，${memberTitle || (member.isLeader ? '负责人' : '成员')}`"
  >
    <img
      class="member-avatar"
      :src="avatarUrl"
      :alt="`${member.username} 头像`"
      loading="lazy"
      @error="onAvatarError"
    />
    <div class="member-name-bar">
      <p class="member-name">{{ member.username }}</p>
      <span v-if="memberTitle" class="member-title">{{ memberTitle }}</span>
    </div>
  </article>
</template>

<style scoped>
.member-card {
  --member-card-max-size: 9.25rem;
  --member-card-size: var(--member-card-max-size);
  position: relative;
  box-sizing: border-box;
  flex: 0 0 var(--member-card-size);
  width: var(--member-card-size);
  min-width: var(--member-card-size);
  max-width: var(--member-card-size);
  aspect-ratio: 1 / 1;
  height: auto;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--bg-sunken);
  border: 2px solid var(--border-dark-2);
  box-shadow:
    inset -2px -2px 0 0 var(--bevel-dark),
    inset 2px 2px 0 0 var(--bevel-light),
    4px 4px var(--shadow);
}

.member-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.member-name-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.72);
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.35s ease;
}

.member-card:hover .member-name-bar,
.member-card:focus-visible .member-name-bar {
  transform: translateY(0);
}

.member-card.leader {
  border-color: #e9c31a;
}

.member-card:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.member-card.leader:focus-visible {
  outline-color: #e9c31a;
}

@media (prefers-reduced-motion: reduce) {
  .member-name-bar {
    transform: translateY(0);
    transition: none;
  }
}

@media screen and (max-width: 900px), (hover: none) {
  .member-name-bar {
    transform: translateY(0);
  }
}

.member-name {
  margin: 0;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 1.2;
}

.member-title {
  display: block;
  margin-top: 0.1rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.65rem;
  line-height: 1.1;
}
</style>
