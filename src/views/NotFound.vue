<script lang="ts" setup>
import loadImageAsset from '@/util/loadimage'
</script>

<template>
  <div class="center">
    <img
      :src="loadImageAsset('404.png')"
      alt="404 Not Found"
      style="width: 30rem; height: auto; margin: auto"
    />
  </div>
</template>

<style lang="css" scoped>
.center {
  height: 100vh;
  width: 100vw;
  padding: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
