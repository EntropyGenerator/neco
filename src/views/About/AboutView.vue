<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { GetDetailedIntroList, type IntroEntity } from '@/api/introlist'
import IntroItem from '@/components/IntroItem.vue'
import { GetDepartmentList, type Department } from '@/api/department'
import DepartmentSection from './DepartmentSection.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const intros = ref<IntroEntity[]>([])
const departments = ref<Department[]>([])
const loadingDepartments = ref(true)
const loadFailed = ref(false)

onMounted(async () => {
  intros.value = GetDetailedIntroList()

  loadingDepartments.value = true
  loadFailed.value = false
  try {
    departments.value = await GetDepartmentList()
  } catch {
    loadFailed.value = true
    toast.error('部门信息加载失败，请稍后重试。')
  } finally {
    loadingDepartments.value = false
  }
})
</script>

<template>
  <div class="main-area">
    <div class="links-area">
      <div class="department-area">
        <h1 id="department-area-title" class="department-area-title">部门与成员</h1>

        <p v-if="loadingDepartments" class="department-status" aria-live="polite">
          正在加载部门信息...
        </p>
        <p
          v-else-if="loadFailed"
          class="department-status department-status-error"
          aria-live="polite"
        >
          部门信息加载失败。
        </p>
        <div v-else-if="departments.length === 0" class="department-empty-state">
          <strong>暂无部门信息</strong>
          <span>管理员可在后台「部门管理」中添加部门与成员。</span>
        </div>

        <DepartmentSection
          v-for="department in departments"
          :key="department.id"
          :department="department"
        />
      </div>
    </div>

    <div class="intro-area">
      <h1 style="opacity: 0; animation: fade-in-down 1s ease-out forwards">
        更多关于我们的事情...
      </h1>
      <IntroItem
        v-for="(intro, index) in intros"
        :key="index"
        :intro="intro"
        :right="index % 2 == 1"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.links-area {
  padding-top: 5rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('/background/links-background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.links-area::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: linear-gradient(to bottom, transparent 0%, var(--background-color) 100%);
}

.intro-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 88rem);
  margin: 2rem auto 0;
  padding: 0 clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}

.intro-area > h1 {
  align-self: center;
  margin: 0 0 1.5rem;
  color: #fff;
  text-align: center;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
}

.department-area {
  position: relative;
  z-index: 1;
  width: min(100%, 88rem);
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.department-area-title {
  margin: 0 0 1rem;
  color: #fff;
  text-align: center;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
}

.department-status {
  margin: 0 0 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.78);
}

.department-status-error {
  color: #f0c36a;
}

.department-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.18);
  border: 2px dashed #666;
}

.department-empty-state strong {
  color: #fff;
  font-size: 1.1rem;
}
</style>
