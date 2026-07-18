<script lang="ts" setup>
import { computed } from 'vue'
import { toAssetUrl, type Department } from '@/api/department'
import DepartmentMemberCarousel from './DepartmentMemberCarousel.vue'

const props = defineProps<{
  department: Department
}>()

const backgroundImage = computed(() => {
  const icon = toAssetUrl(props.department.icon)
  return icon ? `url("${icon}")` : 'none'
})
</script>

<template>
  <section class="department-section" :aria-labelledby="`department-title-${department.id}`">
    <div class="department-info" :style="{ backgroundImage }">
      <div class="department-info-overlay">
        <h2 :id="`department-title-${department.id}`" class="department-name">
          {{ department.name }}
        </h2>
        <p class="department-description">{{ department.description }}</p>
      </div>
    </div>

    <div class="department-members">
      <DepartmentMemberCarousel :members="department.members" />
    </div>
  </section>
</template>

<style scoped>
.department-section {
  --department-info-max-width: 19rem;
  --department-info-aspect-ratio: 19 / 15;
  --member-start-offset: 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, var(--department-info-max-width)) minmax(0, 1fr);
  gap: 1rem;
  width: 100%;
  margin: 2rem 0;
  padding: clamp(0.85rem, 1.7vw, 1rem);
  align-items: stretch;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.62);
  border: 2px solid #1a1a1a;
  box-shadow:
    inset -2px -2px 0 0 #1f1f1f,
    inset 2px 2px 0 0 #454545,
    4px 4px rgba(0, 0, 0, 0.45);
}

.department-info {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--department-info-max-width);
  min-width: 0;
  aspect-ratio: var(--department-info-aspect-ratio);
  height: auto;
  overflow: hidden;
  background-color: #303030;
  background-size: cover;
  background-position: center;
  border: 2px solid #1a1a1a;
  box-shadow:
    inset -2px -2px 0 0 #1f1f1f,
    inset 2px 2px 0 0 #454545,
    4px 4px rgba(0, 0, 0, 0.45);
}

.department-info-overlay {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.88) 0%,
    rgba(0, 0, 0, 0.55) 45%,
    rgba(0, 0, 0, 0.15) 100%
  );
}

.department-name {
  margin: 0 0 0.6rem;
  color: #fff;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  line-height: 1.2;
}

.department-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.8rem;
  line-height: 1.55;
  white-space: pre-wrap;
}

.department-members {
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  align-self: stretch;
  padding-left: var(--member-start-offset);
  box-sizing: border-box;
}

@media screen and (max-width: 900px) {
  .department-section {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .department-info {
    width: min(100%, var(--department-info-max-width));
  }

  .department-members {
    justify-self: stretch;
    padding: 0.75rem;
    padding-left: calc(0.75rem + var(--member-start-offset));
    background: rgba(0, 0, 0, 0.25);
    border: 2px solid #1a1a1a;
    box-shadow:
      inset -2px -2px 0 0 #1f1f1f,
      inset 2px 2px 0 0 #454545;
  }
}

@media screen and (max-width: 480px) {
  .department-section {
    margin: 1.25rem 0;
    padding: 0.75rem;
  }

  .department-info-overlay {
    padding: 0.85rem;
  }

  .department-members {
    padding: 0.65rem;
    padding-left: calc(0.65rem + var(--member-start-offset));
  }
}
</style>
