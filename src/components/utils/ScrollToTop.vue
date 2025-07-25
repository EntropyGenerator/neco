<script lang="ts" setup>
import { ref } from 'vue'
import MinecraftButton from './MinecraftButton.vue'

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const shouldShow = ref(false)

window.addEventListener('scroll', () => {
  shouldShow.value = window.scrollY > 200
})
</script>

<template>
  <MinecraftButton class="scroll-to-top" @click="scrollToTop" :type="shouldShow ? 'show' : 'hide'">
    ↑
  </MinecraftButton>
</template>

<style lang="css" scoped>
.scroll-to-top {
  font-size: 1.5rem;
  position: fixed;
  height: 3rem;
  width: 3rem;
  bottom: 0;
  right: 0;
  z-index: 1000;
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.scroll-to-top[type='hide'] {
  transform: translateY(100%);
  opacity: 0;
}
</style>
