<script lang="ts" setup>
import type { LinkEntity } from '../../api/linklist'

const props = defineProps({
  link: {
    type: Object as () => LinkEntity,
    required: true,
  },
})
</script>

<template>
  <a
    class="link-card"
    :href="props.link.url"
    target="_blank"
    rel="noopener noreferrer"
    :style="{ backgroundImage: `url(${props.link.image})` }"
  >
    <div class="link-content">
      <p>{{ link.name }}</p>
      <span>{{ link.description }}</span>
    </div>
  </a>
</template>

<style lang="css" scoped>
.link-card:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 4px;
}

.link-card {
  color: inherit;
  text-decoration: none;
  margin: 1rem;
  width: 15rem;
  height: 15rem;
  border-top: 2px solid var(--accent-light);
  border-left: 2px solid var(--accent);
  border-right: 2px solid var(--accent);
  border-bottom: 2px solid var(--accent-dark);
  display: flex;
  flex-direction: column;
  position: relative;

  background-position: center;
  background-size: cover;

  box-shadow: 4px 4px var(--shadow);
  cursor: pointer;
}

.link-content {
  margin-top: auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;

  background-color: var(--bg-overlay-strong);
  /* 遮罩底色恒为深色，文字固定浅色（深色模式 --text 即浅色，浅色模式覆盖为白色） */
  color: var(--text);
  user-select: none;
}

[data-theme='light'] .link-content {
  color: var(--text-inverse);
}

.link-content p {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}
</style>
