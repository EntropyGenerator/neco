<script lang="ts" setup>
import type { LinkEntry } from '@/api/links'

const props = defineProps({
  link: {
    type: Object as () => LinkEntry,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <a
    class="link-card"
    :href="props.link.url"
    target="_blank"
    rel="noopener noreferrer"
    :style="{ animationDelay: `${props.index * 0.1}s` }"
  >
    <div class="link-icon">
      <img :src="props.link.icon" :alt="`${props.link.name} 图标`" />
    </div>
    <div class="link-body">
      <p class="link-name">{{ props.link.name }}</p>
      <span class="link-desc">{{ props.link.description }}</span>
      <span class="link-url">{{ props.link.url }}</span>
    </div>
  </a>
</template>

<style lang="css" scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  color: inherit;
  text-decoration: none;
  background-color: rgba(31, 31, 31, 0.92);
  border: 4px solid #222;
  box-shadow:
    inset -3px -3px 0 0 #191919,
    inset 3px 3px 0 0 #484848,
    0 0.5rem 1rem rgba(0, 0, 0, 0.22);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  opacity: 0;
  animation: fade-in-down 0.45s ease-out forwards;
}

.link-card:hover {
  border-color: var(--minecraft-green-light);
  transform: translateY(-2px);
}

.link-card:focus-visible {
  outline: 3px solid var(--minecraft-green-light);
  outline-offset: 3px;
  border-color: var(--minecraft-green-light);
}

.link-icon {
  flex: 0 0 auto;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  border: 2px solid #444;
  box-shadow:
    inset -1px -1px 0 0 #222,
    inset 1px 1px 0 0 #555;
}

.link-icon img {
  width: 2.5rem;
  height: 2.5rem;
  image-rendering: pixelated;
  user-select: none;
}

.link-body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.link-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.link-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.72);
}

.link-url {
  font-size: 0.8rem;
  color: var(--minecraft-green-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media screen and (max-width: 600px) {
  .link-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .link-icon {
    width: 3rem;
    height: 3rem;
  }

  .link-icon img {
    width: 2rem;
    height: 2rem;
  }
}
</style>
