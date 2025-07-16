<script setup lang="ts">
import { useRoute } from 'vue-router'
import Footer from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div class="page-area">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div :key="route.fullPath">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
    <NavBar />
    <Footer />
  </div>
</template>

<style lang="css" scoped>
.page-area {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
