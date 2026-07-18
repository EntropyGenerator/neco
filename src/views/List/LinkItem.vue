<script lang="ts" setup>
import type { LinkEntry } from '@/api/links'

defineProps<{
  link: LinkEntry
}>()
</script>

<template>
  <a class="link-card" :href="link.url" target="_blank" rel="noopener noreferrer">
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
</template>

<style lang="css" scoped>
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

.link-card:hover .link-icon-area::after,
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

.link-card:hover .link-icon-area::before,
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
  margin-bottom: 4px;
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
