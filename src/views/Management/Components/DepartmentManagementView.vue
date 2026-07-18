<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { GetUserList, type UserEntity } from '@/api/auth'
import {
  AddDepartmentMember,
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentList,
  RemoveDepartmentMember,
  UpdateDepartment,
  UpdateDepartmentMemberLeader,
  UpdateDepartmentMemberOrder,
  UpdateDepartmentOrder,
  getMemberTitle,
  toAssetUrl,
  type Department,
} from '@/api/department'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import MinecraftButtonClassic from '@/components/utils/MinecraftButtonClassic.vue'
import MinecraftDialog from '@/components/utils/MinecraftDialog.vue'
import MinecraftInput from '@/components/utils/MinecraftInput.vue'
import MinecraftSwitch from '@/components/utils/MinecraftSwitch.vue'
import MinecraftTextarea from '@/components/utils/MinecraftTextarea.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userGroup = ref<string[]>(JSON.parse(localStorage.getItem('userGroup') || '[]'))

const canManageDepartment = computed(() => userGroup.value.includes('admin'))

const departments = ref<Department[]>([])
const allUsers = ref<UserEntity[]>([])
const selectedDepartmentId = ref<string | null>(null)
const departmentSearchQuery = ref('')
const memberSearchQuery = ref('')
const editStatus = ref<'none' | 'new' | 'edit'>('none')
const deleteDepartmentDialogVisible = ref(false)
const pendingDeleteDepartmentId = ref<string | null>(null)
const iconOptionsVisible = ref(false)
const editIcon = ref('')
const newMemberUsername = ref('')
const newMemberIsLeader = ref(false)

const departmentDraft = reactive({
  id: '',
  name: '',
  description: '',
  icon: '',
  sortOrder: 0,
})

const selectedDepartment = computed(() => {
  if (!selectedDepartmentId.value) return null
  return (
    departments.value.find((department) => department.id === selectedDepartmentId.value) || null
  )
})

const filteredDepartments = computed(() => {
  const query = departmentSearchQuery.value.trim().toLowerCase()
  if (!query) return departments.value
  return departments.value.filter((department) => department.name.toLowerCase().includes(query))
})

const filteredMembers = computed(() => {
  const department = selectedDepartment.value
  if (!department) return []
  const query = memberSearchQuery.value.trim().toLowerCase()
  if (!query) return department.members
  return department.members.filter((member) => member.username.toLowerCase().includes(query))
})

const pendingDeleteDepartment = computed(() => {
  if (!pendingDeleteDepartmentId.value) return null
  return (
    departments.value.find((department) => department.id === pendingDeleteDepartmentId.value) ||
    null
  )
})

const availableUsers = computed(() => {
  const selected = selectedDepartment.value
  if (!selected) return allUsers.value
  const existing = new Set(selected.members.map((member) => member.username))
  return allUsers.value.filter((user) => !existing.has(user.username))
})

const resetDraft = () => {
  Object.assign(departmentDraft, {
    id: '',
    name: '',
    description: '',
    icon: '',
    sortOrder: departments.value.length,
  })
  editIcon.value = ''
}

const refresh = async () => {
  const previousSelectedId = selectedDepartmentId.value
  departments.value = await GetDepartmentList()
  allUsers.value = (await GetUserList()) ?? []

  if (
    previousSelectedId &&
    departments.value.some((department) => department.id === previousSelectedId)
  ) {
    selectedDepartmentId.value = previousSelectedId
  } else if (
    selectedDepartmentId.value &&
    !departments.value.some((department) => department.id === selectedDepartmentId.value)
  ) {
    selectedDepartmentId.value = null
  }
}

const toBase64 = async (image: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (image.size > 1024 * 1024) {
      reject(new Error('File size exceeds 1MB'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(image)
  })
}

const triggerUploadBase64 = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.onchange = async () => {
      const image = input.files?.[0]
      if (!image) {
        reject(new Error('No image selected'))
        return
      }
      try {
        resolve(await toBase64(image))
      } catch (error) {
        reject(error)
      }
    }
  })
}

const onSelectIcon = async () => {
  try {
    departmentDraft.icon = await triggerUploadBase64()
    iconOptionsVisible.value = false
  } catch (error) {
    toast.error(`上传文件失败：${error}`)
  }
}

const onEditIcon = () => {
  iconOptionsVisible.value = true
  editIcon.value = departmentDraft.icon
}

const onSaveIconUrl = () => {
  departmentDraft.icon = editIcon.value
  iconOptionsVisible.value = false
}

const validateDepartment = () => {
  if (departmentDraft.name.trim() === '') {
    toast.error('部门名称不能为空！')
    return false
  }
  if (departmentDraft.description.trim() === '') {
    toast.error('部门介绍不能为空！')
    return false
  }
  return true
}

const onSelectDepartment = (departmentId: string) => {
  selectedDepartmentId.value = departmentId
  newMemberUsername.value = ''
  newMemberIsLeader.value = false
  memberSearchQuery.value = ''
}

const onNewDepartment = () => {
  editStatus.value = 'new'
  selectedDepartmentId.value = null
  memberSearchQuery.value = ''
  resetDraft()
  departmentDraft.sortOrder = departments.value.length
}

const onEditDepartment = () => {
  if (!selectedDepartment.value) {
    toast.warning('请先选择一个部门！')
    return
  }
  editStatus.value = 'edit'
  Object.assign(departmentDraft, selectedDepartment.value)
  departmentDraft.icon = selectedDepartment.value.icon || ''
  editIcon.value = departmentDraft.icon
}

const cancelEditDepartment = () => {
  editStatus.value = 'none'
  resetDraft()
}

const commitDepartment = async () => {
  if (!validateDepartment()) return

  if (editStatus.value === 'new') {
    const { id, error } = await CreateDepartment({
      name: departmentDraft.name.trim(),
      description: departmentDraft.description.trim(),
      icon: departmentDraft.icon,
      sortOrder: departmentDraft.sortOrder,
    })
    if (error || !id) {
      toast.error(`创建部门失败：${error || '未知错误'}`)
      return
    }
    toast.success('部门创建成功！')
  } else {
    const payload: Department = {
      id: departmentDraft.id,
      name: departmentDraft.name.trim(),
      description: departmentDraft.description.trim(),
      icon: departmentDraft.icon,
      sortOrder: departmentDraft.sortOrder,
      members: selectedDepartment.value?.members ?? [],
    }
    const error = await UpdateDepartment(payload)
    if (error) {
      toast.error(`保存部门失败：${error}`)
      return
    }
    toast.success('部门保存成功！')
  }

  editStatus.value = 'none'
  resetDraft()
  await refresh()
}

const openDeleteDepartmentDialog = (departmentId: string) => {
  pendingDeleteDepartmentId.value = departmentId
  deleteDepartmentDialogVisible.value = true
}

const onConfirmDeleteDepartment = async () => {
  const target = pendingDeleteDepartment.value
  if (!target) return

  const error = await DeleteDepartment(target.id)
  if (error) {
    toast.error(`删除部门失败：${error}`)
    return
  }

  toast.success('部门删除成功！')
  pendingDeleteDepartmentId.value = null
  if (selectedDepartmentId.value === target.id) {
    selectedDepartmentId.value = null
    memberSearchQuery.value = ''
  }
  editStatus.value = 'none'
  await refresh()
}

const persistDepartmentOrder = async () => {
  const orders = departments.value.map((department, index) => ({
    id: department.id,
    sortOrder: index,
  }))
  const error = await UpdateDepartmentOrder(orders)
  if (error) {
    toast.error(`更新部门顺序失败：${error}`)
    await refresh()
    return
  }
  departments.value = departments.value.map((department, index) => ({
    ...department,
    sortOrder: index,
  }))
}

const moveDepartment = async (departmentId: string, offset: number) => {
  const index = departments.value.findIndex((department) => department.id === departmentId)
  if (index < 0) return

  const targetIndex = index + offset
  if (targetIndex < 0 || targetIndex >= departments.value.length) return

  const next = [...departments.value]
  const current = next[index]
  next[index] = next[targetIndex]
  next[targetIndex] = current
  departments.value = next

  await persistDepartmentOrder()
}

const moveDepartmentToTop = async (departmentId: string) => {
  const index = departments.value.findIndex((department) => department.id === departmentId)
  if (index <= 0) return

  const next = [...departments.value]
  const [current] = next.splice(index, 1)
  next.unshift(current)
  departments.value = next

  await persistDepartmentOrder()
}

const persistMemberOrder = async (department: Department) => {
  const members = department.members.map((member, index) => ({
    username: member.username,
    sortOrder: index,
    isLeader: Boolean(member.isLeader),
  }))
  const error = await UpdateDepartmentMemberOrder(department.id, members)
  if (error) {
    toast.error(`更新成员信息失败：${error}`)
    await refresh()
  }
}

const findMemberIndex = (department: Department, username: string) => {
  return department.members.findIndex((member) => member.username === username)
}

const toggleMemberLeader = async (username: string) => {
  const departmentId = selectedDepartmentId.value
  if (!departmentId) return

  const department = departments.value.find((item) => item.id === departmentId)
  if (!department) return

  const memberIndex = findMemberIndex(department, username)
  const member = department.members[memberIndex]
  if (!member) return

  const nextIsLeader = !Boolean(member.isLeader)
  const error = await UpdateDepartmentMemberLeader(departmentId, username, nextIsLeader)
  if (error) {
    toast.error(`更新负责人状态失败：${error}`)
    return
  }

  await refresh()
  selectedDepartmentId.value = departmentId
  toast.success(nextIsLeader ? '已设为负责人' : '已取消负责人')
}

const moveMember = async (username: string, offset: number) => {
  const department = selectedDepartment.value
  if (!department) return

  const memberIndex = findMemberIndex(department, username)
  if (memberIndex < 0) return

  const targetIndex = memberIndex + offset
  if (targetIndex < 0 || targetIndex >= department.members.length) return

  const nextMembers = [...department.members]
  const current = nextMembers[memberIndex]
  nextMembers[memberIndex] = nextMembers[targetIndex]
  nextMembers[targetIndex] = current
  department.members = nextMembers

  await persistMemberOrder(department)
}

const moveMemberToTop = async (username: string) => {
  const department = selectedDepartment.value
  if (!department) return

  const memberIndex = findMemberIndex(department, username)
  if (memberIndex <= 0) return

  const nextMembers = [...department.members]
  const [current] = nextMembers.splice(memberIndex, 1)
  nextMembers.unshift(current)
  department.members = nextMembers

  await persistMemberOrder(department)
}

const onAddMember = async () => {
  const department = selectedDepartment.value
  if (!department) {
    toast.warning('请先选择一个部门！')
    return
  }

  const username = newMemberUsername.value.trim()
  if (username === '') {
    toast.error('请输入要添加的用户名！')
    return
  }

  const error = await AddDepartmentMember(
    department.id,
    username,
    department.members.length,
    newMemberIsLeader.value,
  )
  if (error) {
    toast.error(`添加成员失败：${error}`)
    return
  }

  toast.success('成员添加成功！')
  newMemberUsername.value = ''
  newMemberIsLeader.value = false
  await refresh()
  selectedDepartmentId.value = department.id
}

const onRemoveMember = async (username: string) => {
  const department = selectedDepartment.value
  if (!department) return

  const error = await RemoveDepartmentMember(department.id, username)
  if (error) {
    toast.error(`移除成员失败：${error}`)
    return
  }

  toast.success('成员已移除！')
  await refresh()
  selectedDepartmentId.value = department.id
}

onMounted(refresh)
</script>

<template>
  <div class="management-tab-title-container">
    <h1 class="management-tab-title">部门管理</h1>
    <span class="management-tab-subtitle">组织架构，一目了然</span>
  </div>

  <section
    v-if="!canManageDepartment"
    class="management-section"
    aria-labelledby="department-no-permission-title"
  >
    <div class="management-empty-state">
      <strong id="department-no-permission-title">权限不足</strong>
      <span>只有超级管理员可以管理部门与成员。</span>
    </div>
  </section>

  <template v-else>
    <section class="management-section" aria-labelledby="department-list-title">
      <div class="management-section-header">
        <div class="management-section-title-block">
          <h2 id="department-list-title" class="management-section-title">部门列表</h2>
          <p class="management-section-desc">
            当前共有 {{ departments.length }} 个部门，筛选显示
            {{ filteredDepartments.length }} 个。可通过置顶/上移/下移调整关于页展示顺序。
          </p>
        </div>

        <div class="management-toolbar">
          <MinecraftButtonClassic class="dept-toolbar-button" @click="refresh">
            刷新列表
          </MinecraftButtonClassic>
          <MinecraftButtonClassic class="dept-toolbar-button" @click="onNewDepartment">
            添加部门
          </MinecraftButtonClassic>
        </div>
      </div>

      <div class="search-row">
        <label class="management-field-label" for="department-search-input">搜索部门</label>
        <MinecraftInput
          id="department-search-input"
          v-model="departmentSearchQuery"
          placeholder="输入部门名称"
          aria-label="搜索部门名称"
        />
      </div>

      <div v-if="departments.length > 0 && filteredDepartments.length > 0" class="department-list">
        <article
          v-for="department in filteredDepartments"
          :key="department.id"
          class="department-list-item"
          :class="{ selected: selectedDepartmentId === department.id }"
        >
          <button
            type="button"
            class="department-list-main"
            :aria-pressed="selectedDepartmentId === department.id"
            @click="onSelectDepartment(department.id)"
          >
            <img
              v-if="department.icon"
              class="department-list-icon"
              :src="toAssetUrl(department.icon)"
              :alt="`${department.name} 配图`"
            />
            <span class="department-list-text">
              <strong>{{ department.name }}</strong>
              <span>
                顺序
                {{ departments.findIndex((item) => item.id === department.id) + 1 }} · 成员
                {{ department.members.length }} 人
              </span>
            </span>
          </button>

          <div class="department-list-actions">
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="departments.findIndex((item) => item.id === department.id) === 0"
              @click="moveDepartmentToTop(department.id)"
            >
              置顶
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="departments.findIndex((item) => item.id === department.id) === 0"
              @click="moveDepartment(department.id, -1)"
            >
              上移
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="
                departments.findIndex((item) => item.id === department.id) ===
                departments.length - 1
              "
              @click="moveDepartment(department.id, 1)"
            >
              下移
            </MinecraftButtonClassic>
            <button
              type="button"
              class="dept-delete-button"
              aria-label="删除部门"
              @click="openDeleteDepartmentDialog(department.id)"
            >
              <DeleteIcon aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>

      <div v-else-if="departments.length > 0" class="management-empty-state">
        <strong>没有匹配的部门</strong>
        <span>请尝试更换搜索关键词，或清空搜索框。</span>
      </div>

      <div v-else class="management-empty-state">
        <strong>暂无部门</strong>
        <span>点击“添加部门”创建第一个部门。</span>
      </div>

      <div class="management-action-row">
        <span class="dept-selected-text">当前选中：{{ selectedDepartment?.name || '无' }}</span>
        <MinecraftButtonClassic
          class="dept-toolbar-button"
          @click="selectedDepartment ? onEditDepartment() : toast.warning('请先选择部门！')"
        >
          编辑选中部门
        </MinecraftButtonClassic>
      </div>
    </section>

    <form
      v-if="editStatus !== 'none'"
      class="management-section"
      aria-labelledby="department-edit-title"
      @submit.prevent="commitDepartment"
    >
      <div class="management-section-header">
        <div class="management-section-title-block">
          <h2 id="department-edit-title" class="management-section-title">
            {{ editStatus === 'new' ? '新增部门' : '编辑部门' }}
          </h2>
          <p class="management-section-desc">配置部门名称、介绍与关于页展示配图。</p>
        </div>
      </div>

      <section class="management-card" aria-labelledby="department-basic-title">
        <h3 id="department-basic-title" class="management-card-title">基础信息</h3>
        <div class="management-grid-form">
          <div class="management-field">
            <label class="management-field-label" for="department-name-input">部门名称</label>
            <MinecraftInput
              id="department-name-input"
              v-model="departmentDraft.name"
              placeholder="例如 运维保障部"
            />
          </div>

          <div class="management-field">
            <span class="management-field-label">展示顺序</span>
            <MinecraftInput :model-value="String(departmentDraft.sortOrder + 1)" disabled />
            <p class="management-field-help">顺序请在列表中使用上移/下移调整。</p>
          </div>

          <div class="management-field full">
            <label class="management-field-label" for="department-description-input"
              >部门介绍</label
            >
            <MinecraftTextarea
              id="department-description-input"
              v-model="departmentDraft.description"
              placeholder="请输入部门介绍"
              rows="4"
            />
          </div>
        </div>
      </section>

      <section class="management-card" aria-labelledby="department-icon-title">
        <h3 id="department-icon-title" class="management-card-title">部门配图</h3>
        <div class="management-grid-form">
          <div class="management-field">
            <span class="management-field-label">配图</span>
            <button
              v-if="departmentDraft.icon.trim() === ''"
              type="button"
              class="upload-button"
              aria-label="上传部门配图"
              @click="onEditIcon"
            >
              <PlusIcon aria-hidden="true" />
            </button>
            <button
              v-else
              type="button"
              class="dept-image-picture"
              aria-label="更换部门配图"
              @click="onEditIcon"
            >
              <img class="dept-image" :src="toAssetUrl(departmentDraft.icon)" alt="" />
            </button>
          </div>
        </div>
      </section>

      <div class="management-action-row">
        <MinecraftButtonClassic class="dept-toolbar-button" @click="cancelEditDepartment">
          取消
        </MinecraftButtonClassic>
        <MinecraftButtonClassic class="dept-toolbar-button" native-type="submit">
          保存部门
        </MinecraftButtonClassic>
      </div>
    </form>

    <section
      v-if="selectedDepartment"
      class="management-section"
      aria-labelledby="department-member-title"
    >
      <div class="management-section-header">
        <div class="management-section-title-block">
          <h2 id="department-member-title" class="management-section-title">
            {{ selectedDepartment.name }} · 成员管理
          </h2>
          <p class="management-section-desc">
            同一用户可加入多个部门。负责人会优先展示在关于页成员列表前面。
          </p>
        </div>
      </div>

      <section class="management-card" aria-labelledby="department-add-member-title">
        <h3 id="department-add-member-title" class="management-card-title">添加成员</h3>
        <div class="member-add-row">
          <MinecraftInput
            id="department-member-input"
            v-model="newMemberUsername"
            list="department-user-options"
            placeholder="输入用户名"
          />
          <datalist id="department-user-options">
            <option v-for="user in availableUsers" :key="user.username" :value="user.username" />
          </datalist>
          <div class="member-leader-field">
            <label class="management-field-label" for="department-member-leader-switch">
              设为负责人
            </label>
            <MinecraftSwitch id="department-member-leader-switch" v-model="newMemberIsLeader" />
          </div>
          <MinecraftButtonClassic class="dept-toolbar-button" @click="onAddMember">
            添加成员
          </MinecraftButtonClassic>
        </div>
        <p class="management-field-help">
          成员职位标签仍可在「用户管理」中维护，用于关于页名称下方展示。
        </p>
      </section>

      <div class="search-row">
        <label class="management-field-label" for="member-search-input">搜索成员</label>
        <MinecraftInput
          id="member-search-input"
          v-model="memberSearchQuery"
          placeholder="输入用户名"
          aria-label="搜索部门成员用户名"
        />
      </div>

      <div
        v-if="selectedDepartment.members.length > 0 && filteredMembers.length > 0"
        class="member-list"
      >
        <article v-for="member in filteredMembers" :key="member.username" class="member-list-item">
          <div class="member-list-main">
            <strong>{{ member.username }}</strong>
            <span>{{ getMemberTitle(member) || '成员' }}</span>
            <span v-if="member.isLeader" class="member-leader-badge">负责人</span>
          </div>
          <div class="member-list-actions">
            <MinecraftButtonClassic
              class="dept-mini-button"
              @click="toggleMemberLeader(member.username)"
            >
              {{ member.isLeader ? '取消负责人' : '设为负责人' }}
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="findMemberIndex(selectedDepartment, member.username) === 0"
              @click="moveMemberToTop(member.username)"
            >
              置顶
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="findMemberIndex(selectedDepartment, member.username) === 0"
              @click="moveMember(member.username, -1)"
            >
              上移
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              :disabled="
                findMemberIndex(selectedDepartment, member.username) ===
                selectedDepartment.members.length - 1
              "
              @click="moveMember(member.username, 1)"
            >
              下移
            </MinecraftButtonClassic>
            <MinecraftButtonClassic
              class="dept-mini-button"
              @click="onRemoveMember(member.username)"
            >
              移除
            </MinecraftButtonClassic>
          </div>
        </article>
      </div>

      <div v-else-if="selectedDepartment.members.length > 0" class="management-empty-state">
        <strong>没有匹配的成员</strong>
        <span>请尝试更换搜索关键词，或清空搜索框。</span>
      </div>

      <div v-else class="management-empty-state">
        <strong>暂无成员</strong>
        <span>添加用户后，关于页会展示该部门成员卡片。</span>
      </div>
    </section>
  </template>

  <MinecraftDialog title="编辑部门配图" v-model="iconOptionsVisible">
    <div class="icon-options-container">
      <label class="icon-options-label" for="department-icon-url">图片地址</label>
      <div class="icon-options-input-container">
        <MinecraftInput
          id="department-icon-url"
          class="icon-options-input"
          v-model="editIcon"
          placeholder="填入图片链接或 base64"
        />
        <MinecraftButtonClassic class="icon-options-button" @click="onSaveIconUrl">
          保存
        </MinecraftButtonClassic>
      </div>
    </div>

    <div class="icon-options-container">
      <span class="icon-options-label">直接上传</span>
      <MinecraftButtonClassic
        class="icon-options-button"
        style="width: 10rem"
        @click="onSelectIcon"
      >
        ↑ 点击上传
      </MinecraftButtonClassic>
    </div>

    <template #footer>
      <span></span>
    </template>
  </MinecraftDialog>

  <MinecraftDialog
    title="删除部门"
    v-model="deleteDepartmentDialogVisible"
    @confirm="onConfirmDeleteDepartment"
  >
    <p>
      确定要删除
      <strong>{{ pendingDeleteDepartment?.name || '这个部门' }}</strong>
      吗？
    </p>
    <p class="management-danger-text">删除后关于页将不再显示该部门及其成员关系。</p>
  </MinecraftDialog>
</template>

<style scoped>
.dept-toolbar-button,
.dept-mini-button {
  width: 10rem;
}

.dept-mini-button {
  width: 6rem;
}

.dept-selected-text {
  margin-right: auto;
  color: rgba(255, 255, 255, 0.72);
  align-self: center;
}

.search-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.department-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.department-list-item {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
  background-color: #303030;
  border: 2px solid #1a1a1a;
}

.department-list-item.selected {
  border-color: var(--minecraft-green-light);
}

.department-list-main {
  flex: 1;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.department-list-main:focus-visible {
  outline: 3px solid #fff;
  outline-offset: -3px;
}

.department-list-icon {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  flex: 0 0 auto;
}

.department-list-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  text-align: left;
}

.department-list-text strong {
  color: #fff;
  font-size: 1.05rem;
}

.department-list-text span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;
}

.department-list-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  flex-wrap: wrap;
}

.dept-delete-button {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.dept-delete-button:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

.upload-button,
.dept-image-picture {
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.upload-button:focus-visible,
.dept-image-picture:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 4px;
}

.upload-button {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #fff;
  cursor: pointer;
}

.dept-image {
  height: 6rem;
  width: auto;
  max-width: 12rem;
  object-fit: cover;
}

.member-add-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.member-leader-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 8rem;
}

.member-leader-badge {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.1rem 0.45rem;
  color: #fff;
  background: var(--minecraft-green);
  font-size: 0.75rem;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-list-item {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.75rem;
  background-color: #303030;
  border: 2px solid #1a1a1a;
}

.member-list-main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.member-list-main strong {
  color: #fff;
}

.member-list-main span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;
}

.member-list-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.icon-options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-options-label {
  font-size: 1.2rem;
}

.icon-options-input-container {
  display: flex;
  gap: 1rem;
}

.icon-options-input {
  width: 100%;
}

.icon-options-button {
  width: 6rem;
}

@media screen and (max-width: 768px) {

  .department-list-item,
  .member-list-item {
    flex-direction: column;
    align-items: stretch;
  }

  .dept-selected-text {
    margin-right: 0;
  }
}
</style>
