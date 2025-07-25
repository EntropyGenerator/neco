<script lang="ts" setup>
import type { NewsBrief } from '@/api/newslist'
import MinecraftButton from '@/components/utils/MinecraftButton.vue'

const props = defineProps({
  newsBrief: {
    type: Object as () => NewsBrief,
    required: true
  },
  buttonText: {
    type: String,
    default: '了解更多'
  }
})
</script>

<template>
  <div class="overview-card">
    <picture>
      <img
        class="overview-img"
        :src="props.newsBrief.image"
      />
    </picture>
    <div class="overview-content">
      <text class="overview title">
        {{ props.newsBrief.title }}
      </text>
      <text class="overview">
        {{ props.newsBrief.brief }}
      </text>
      <MinecraftButton
        class="overview button"
      >
        {{ props.buttonText }}<div style="width: 1.2rem;"></div>>
      </MinecraftButton>
    </div>
  </div>
</template>

<style lang="css" scoped>
.overview-card {
  opacity: 0;
  flex: 1;
  display: flex;
  width: 100%;
  background-color: var(--background-card);
}

.overview-content {
  display: flex;
  flex-direction: column;
}

.overview {
  margin-right: 1rem;
  margin-left: 1rem;
  margin-top: 1rem;
  user-select: none;
}

.overview.title {
  font-size: 1.3rem;
}

.overview.button {
  height: 1.2rem;
  width: 8rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.overview-img {
  height: 100%;
  object-fit: cover;
  object-position: center;
  max-width: 100%;
  width: 100%;
  vertical-align: middle;
  border-style: none;
}
</style>