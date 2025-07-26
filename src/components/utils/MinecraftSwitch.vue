<script lang="ts" setup>
const model = defineModel<boolean>({
  default: false,
})

const soundOn = () => {
  const audio = new Audio(
    'https://unpkg.com/minecraft-framework-css@1.1.5/css/assets/random.click.ogg',
  )
  audio.play()
  audio.volume = 0.3
}
</script>

<template>
  <input
    class="minecraft-switch"
    type="checkbox"
    :checked="model"
    @click="((model = !model), soundOn())"
  />
</template>

<style lang="css">
.minecraft-switch {
  appearance: none;
  color: transparent;
  width: 60px;
  height: 32px;
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_off.png');
}

.minecraft-switch:hover {
  appearance: none;
  color: transparent;
  width: 60px;
  height: 32px;
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_off_hover.png');
}

.minecraft-switch:checked {
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_on.png');
}

.minecraft-switch:checked:hover {
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_on_hover.png');
}

.minecraft-switch[new=''] {
  appearance: none;
  color: transparent;
  width: 60px;
  height: 32px;
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_off_new.png');
}

.minecraft-switch[new='']:checked {
  background-image: url('https://unpkg.com/minecraft-framework-css@1.1.8/css/assets/toggle_on_new.png');
}
</style>
