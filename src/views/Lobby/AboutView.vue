<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GetDetailedIntroList, type IntroEntity } from '@/api/introlist'
import IntroItem from '@/components/IntroItem.vue'
const intros = ref<IntroEntity[]>([])
onMounted(() => {
  intros.value = GetDetailedIntroList()
})
</script>

<template>
  <div class="about-area">
    <div class="about-header" ref="headerRef">
      <h1 class="mctitle">
        关于我们
      </h1>
    </div>
    <IntroItem
      v-for="(intro, index) in intros"
      :key="index"
      :intro="intro"
      :right="index % 2 == 1"
    />
  </div>
</template>

<style lang="css" scoped>
.about-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 80rem);
  margin: 2rem auto 0;
  padding: 0 clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}
.about-header {
  margin-bottom: 1rem;
}
.about-header h1 {
  opacity: 0;
  animation: fade-in-down 1s ease-out forwards;
  margin-bottom: 1rem;
}

.about-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 45rem;
  border-top: 2px dashed gray;
}
.about-title h2 {
  margin-bottom: 0.5rem;
}
.about-title p {
  margin-top: 0px;
}
</style>
