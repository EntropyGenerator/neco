<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  CreateGlossary,
  UpdateGlossary,
  DeleteGlossary,
  GetGlossaryList,
  CreateItem,
  UpdateItem,
  DeleteItem,
  GetItemList,
  UploadWikiFile,
  type GlossaryEntry,
  type ItemEntry,
} from '@/api/wiki'
import MinecraftButtonClassic from '@/components/utils/MinecraftButtonClassic.vue'
import MinecraftButton from '@/components/utils/MinecraftButton.vue'
import MinecraftDialog from '@/components/utils/MinecraftDialog.vue'
import MinecraftInput from '@/components/utils/MinecraftInput.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import {
  MdEditor,
  MdPreview,
  type ToolbarNames,
} from 'md-editor-v3'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userGroup = ref<string[]>(JSON.parse(localStorage.getItem('userGroup') || '[]'))

const editorToolbars = ref<ToolbarNames[]>([
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  0,
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  1,
  '=',
  'pageFullscreen',
  'fullscreen',
  'catalog',
])

const soundOn = () => {
  const audio = new Audio('/button.click.ogg')
  audio.volume = 0.3
  audio.play().catch(() => {})
}

const mountSounds = () => {
  const buttons = document.querySelectorAll(
    '.md-editor-copy-button, .md-editor-collapse-tips, .md-editor-code-flag',
  )
  buttons.forEach((button) => {
    button.addEventListener('click', soundOn)
  })
}

const scrollTo = (id: string) => {
  setTimeout(() => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const canManage = computed(() => {
  return userGroup.value.includes('admin') || userGroup.value.includes('document_admin')
})

const activeTab = ref<'glossary' | 'item'>('glossary')

const glossaryList = ref<GlossaryEntry[]>([])
const itemList = ref<ItemEntry[]>([])

const editStatus = ref<'none' | 'new' | 'edit'>('none')
const editingId = ref('')
const deleteDialogVisible = ref(false)
const pendingDeleteId = ref('')
const pendingDeleteName = ref('')

const preview = ref(false)
const contentText = ref('')

const glossaryDraft = reactive<Partial<GlossaryEntry>>({
  name: '',
  type: '',
  gallery: '[]',
  content: '',
})

const itemDraft = reactive<Partial<ItemEntry>>({
  name: '',
  type: '',
  image: '',
  maxStack: 64,
  recipe: '[]',
  content: '',
})

const galleryImages = ref<string[]>([])
const recipeSlots = ref<string[]>(Array(9).fill(''))

const refresh = async () => {
  if (!canManage.value) return
  glossaryList.value = await GetGlossaryList()
  itemList.value = await GetItemList()
}

const resetGlossaryDraft = () => {
  Object.assign(glossaryDraft, { name: '', type: '', gallery: '[]', content: '' })
  galleryImages.value = []
  contentText.value = ''
}

const resetItemDraft = () => {
  Object.assign(itemDraft, { name: '', type: '', image: '', maxStack: 64, recipe: '[]', content: '' })
  recipeSlots.value = Array(9).fill('')
  contentText.value = ''
}

const triggerUpload = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const tempId = editingId.value || 'wiki-upload'
      const result = await UploadWikiFile(tempId, file)
      if (result) {
        toast.success('上传图片成功！')
        resolve(result)
      } else {
        toast.error('上传图片失败！')
        resolve(null)
      }
    }
  })
}

const addGalleryImage = async () => {
  const url = await triggerUpload()
  if (url) galleryImages.value.push(url)
}

const removeGalleryImage = (index: number) => {
  galleryImages.value.splice(index, 1)
}

const uploadItemImage = async () => {
  const url = await triggerUpload()
  if (url) itemDraft.image = url
}

const uploadImgInEditor = async (
  files: Array<File>,
  callback: (urls: string[] | { url: string; alt: string; title: string }[]) => void,
) => {
  const res = await Promise.all(
    files.map(async (file) => {
      const tempId = editingId.value || 'wiki-upload'
      const result = await UploadWikiFile(tempId, file)
      if (result) {
        toast.success('上传图片成功！')
        return result
      } else {
        toast.error('上传图片失败！')
        return ''
      }
    }),
  )
  callback(res)
}

const startNewGlossary = () => {
  resetGlossaryDraft()
  editingId.value = ''
  editStatus.value = 'new'
  preview.value = false
}

const startEditGlossary = (entry: GlossaryEntry) => {
  Object.assign(glossaryDraft, {
    name: entry.name,
    type: entry.type,
    gallery: entry.gallery,
    content: entry.content,
  })
  try {
    galleryImages.value = JSON.parse(entry.gallery || '[]') as string[]
  } catch {
    galleryImages.value = []
  }
  contentText.value = entry.content || ''
  editingId.value = entry.id
  editStatus.value = 'edit'
  preview.value = false
  scrollTo('wiki-editor')
}

const saveGlossary = async () => {
  glossaryDraft.gallery = JSON.stringify(galleryImages.value)

  glossaryDraft.content = contentText.value

  if (!glossaryDraft.name?.trim()) {
    toast.warning('请输入词条名称')
    return
  }

  if (editStatus.value === 'new') {
    await CreateGlossary(glossaryDraft)
    toast.success('词条创建成功')
  } else {
    await UpdateGlossary(editingId.value, glossaryDraft)
    toast.success('词条更新成功')
  }
  editStatus.value = 'none'
  await refresh()
}

const confirmDeleteGlossary = (entry: GlossaryEntry) => {
  pendingDeleteId.value = entry.id
  pendingDeleteName.value = entry.name
  deleteDialogVisible.value = true
}

const doDeleteGlossary = async () => {
  await DeleteGlossary(pendingDeleteId.value)
  toast.success('词条已删除')
  deleteDialogVisible.value = false
  await refresh()
}

const startNewItem = () => {
  resetItemDraft()
  editingId.value = ''
  editStatus.value = 'new'
  preview.value = false
}

const startEditItem = (entry: ItemEntry) => {
  Object.assign(itemDraft, {
    name: entry.name,
    type: entry.type,
    image: entry.image,
    maxStack: entry.maxStack,
    recipe: entry.recipe,
    content: entry.content,
  })
  try {
    const arr = JSON.parse(entry.recipe || '[]') as string[]
    recipeSlots.value = Array(9).fill('')
    for (let i = 0; i < Math.min(arr.length, 9); i++) {
      recipeSlots.value[i] = typeof arr[i] === 'string' ? arr[i] : ''
    }
  } catch {
    recipeSlots.value = Array(9).fill('')
  }
  contentText.value = entry.content || ''
  editingId.value = entry.id
  editStatus.value = 'edit'
  preview.value = false
  scrollTo('wiki-editor')
}

const saveItem = async () => {
  const filled = recipeSlots.value.filter((s) => s.trim() !== '')
  if (filled.length === 0) {
    itemDraft.recipe = '[]'
  } else {
    itemDraft.recipe = JSON.stringify(recipeSlots.value.map((s) => s.trim()))
  }

  itemDraft.content = contentText.value

  if (!itemDraft.name?.trim()) {
    toast.warning('请输入物品名称')
    return
  }

  if (editStatus.value === 'new') {
    await CreateItem(itemDraft)
    toast.success('物品创建成功')
  } else {
    await UpdateItem(editingId.value, itemDraft)
    toast.success('物品更新成功')
  }
  editStatus.value = 'none'
  await refresh()
}

const confirmDeleteItem = (entry: ItemEntry) => {
  pendingDeleteId.value = entry.id
  pendingDeleteName.value = entry.name
  deleteDialogVisible.value = true
}

const doDeleteItem = async () => {
  await DeleteItem(pendingDeleteId.value)
  toast.success('物品已删除')
  deleteDialogVisible.value = false
  await refresh()
}

onMounted(async () => {
  if (canManage.value) {
    await refresh()
  }
})
</script>

<template>
  <div v-if="!canManage" class="management-section">
    <div class="management-empty-state">
      <strong>暂无权限</strong>
      <span>您没有管理百科词条/物品的权限，请联系管理员。</span>
    </div>
  </div>

  <template v-else>
    <div class="management-section-header management-section"  v-if="editStatus === 'none'">
      <div class="management-section-title-block">
        <h1 class="management-section-title">百科管理</h1>
        <p class="management-section-desc">管理 Wiki 词条与物品信息</p>
      </div>
      <div class="management-toolbar">
        <div class="wiki-admin-tabs">
          <button
            :class="['wiki-admin-tab', { active: activeTab === 'glossary' }]"
            @click="activeTab = 'glossary'"
          >
            词条百科
          </button>
          <button
            :class="['wiki-admin-tab', { active: activeTab === 'item' }]"
            @click="activeTab = 'item'"
          >
            物品百科
          </button>
        </div>
      </div>
    </div>

    <div v-if="editStatus !== 'none'" class="management-tab-form wiki-edit-section">
      <h2 class="management-tab-form-title">
        {{ editStatus === 'new' ? '新建' : '编辑' }}{{ activeTab === 'glossary' ? '词条' : '物品' }}
      </h2>

      <template v-if="activeTab === 'glossary'">
        <div class="management-grid-form">
          <div class="management-field">
            <label class="management-field-label">名称</label>
            <MinecraftInput v-model="glossaryDraft.name" placeholder="词条名称" />
          </div>
          <div class="management-field full">
            <label class="management-field-label">类型</label>
            <div class="wiki-type-group">
              <MinecraftButtonClassic
                v-for="t in ['人文', '地理', '其它']"
                :key="t"
                :activated="glossaryDraft.type === t"
                class="wiki-type-btn"
                @click="glossaryDraft.type = t"
              >
                {{ t }}
              </MinecraftButtonClassic>
            </div>
          </div>
          <div class="management-field full">
            <label class="management-field-label">相册图片</label>
            <div class="gallery-upload-area">
              <div
                v-for="(img, i) in galleryImages"
                :key="i"
                class="gallery-thumb"
              >
                <img :src="img" alt="" />
                <button
                  type="button"
                  class="gallery-remove-btn"
                  :aria-label="`删除第 ${i + 1} 张图片`"
                  @click="removeGalleryImage(i)"
                >
                  ×
                </button>
              </div>
              <button type="button" class="gallery-add-btn" @click="addGalleryImage">
                <PlusIcon style="width: 1.5rem; height: 1.5rem" />
              </button>
            </div>
            <p class="management-field-help">点击 + 号上传图片，相册支持多张</p>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'item'">
        <div class="management-grid-form">
          <div class="management-field">
            <label class="management-field-label">名称</label>
            <MinecraftInput v-model="itemDraft.name" placeholder="物品名称" />
          </div>
          <div class="management-field full">
            <label class="management-field-label">类型</label>
            <div class="wiki-type-group">
              <MinecraftButtonClassic
                v-for="t in ['工具', '武器', '防具', '食物', '方块', '装饰品', '杂项', '其它']"
                :key="t"
                :activated="itemDraft.type === t"
                class="wiki-type-btn"
                @click="itemDraft.type = t"
              >
                {{ t }}
              </MinecraftButtonClassic>
            </div>
          </div>
          <div class="management-field">
            <label class="management-field-label">物品图片</label>
            <div class="item-image-upload">
              <div v-if="itemDraft.image" class="item-image-preview">
                <img :src="itemDraft.image" alt="" />
              </div>
              <MinecraftButtonClassic @click="uploadItemImage">
                {{ itemDraft.image ? '更换图片' : '上传图片' }}
              </MinecraftButtonClassic>
            </div>
            <p class="management-field-help">点击上传选择图片文件</p>
          </div>
          <div class="management-field">
            <label class="management-field-label">最大堆叠</label>
            <input
              class="minecraft-input"
              type="number"
              min="1"
              max="999"
              v-model.number="itemDraft.maxStack"
            />
          </div>
          <div class="management-field full">
            <label class="management-field-label">合成表 (3×3 工作台)</label>
            <div class="recipe-grid-editor">
              <div class="recipe-grid-outer">
                <div v-for="(_slot, i) in recipeSlots" :key="i" class="recipe-slot-editor">
                  <input
                    class="recipe-slot-input"
                    type="text"
                    v-model="recipeSlots[i]"
                    :placeholder="(i + 1).toString()"
                    maxlength="64"
                  />
                </div>
              </div>
              <div class="recipe-arrow">→</div>
              <div class="recipe-result">
                <div v-if="itemDraft.image" class="recipe-result-img">
                  <img :src="itemDraft.image" alt="" />
                </div>
                <span v-else class="recipe-result-empty">?</span>
              </div>
            </div>
            <p class="management-field-help">按 Minecraft 工作台布局填入物品名称，空格留空</p>
          </div>
        </div>
      </template>

      <div class="management-field full" style="margin-top: 1rem">
        <label class="management-field-label">介绍文本 (Markdown)</label>

        <div class="wiki-editor-bar">
          <MinecraftButtonClassic
            class="wiki-editor-toggle"
            :activated="!preview"
            @click="((preview = false), scrollTo('wiki-editor'))"
          >
            编辑
          </MinecraftButtonClassic>
          <MinecraftButtonClassic
            class="wiki-editor-toggle"
            :activated="preview"
            @click="preview = true"
          >
            预览
          </MinecraftButtonClassic>
        </div>

        <div id="wiki-editor">
          <MdEditor
            v-show="!preview"
            style="height: 100vh"
            theme="dark"
            language="zh-CN"
            preview-theme="minecraft"
            :toolbars="editorToolbars"
            v-model="contentText"
            @on-remount="mountSounds"
            :preview="false"
            @on-upload-img="uploadImgInEditor"
          />
          <div v-show="preview" class="wiki-preview-area">
            <MdPreview
              theme="dark"
              language="zh-CN"
              preview-theme="minecraft"
              :model-value="contentText"
              @on-remount="mountSounds"
            />
          </div>
        </div>
      </div>

      <div class="management-action-row">
        <MinecraftButtonClassic @click="editStatus = 'none'">取消</MinecraftButtonClassic>
        <MinecraftButtonClassic
          @click="activeTab === 'glossary' ? saveGlossary() : saveItem()"
        >
          保存
        </MinecraftButtonClassic>
      </div>
    </div>

    <div v-if="editStatus === 'none'" class="management-section">
      <div class="management-section-header">
        <div class="management-section-title-block">
          <h2 class="management-section-title">
            {{ activeTab === 'glossary' ? '词条列表' : '物品列表' }}
          </h2>
          <p class="management-section-desc">
            共
            {{ activeTab === 'glossary' ? glossaryList.length : itemList.length }}
            条记录
          </p>
        </div>
        <div class="management-toolbar">
          <MinecraftButtonClassic
            v-if="activeTab === 'glossary'"
            @click="startNewGlossary"
          >
            <PlusIcon style="width: 1rem; height: 1rem; margin-right: 0.25rem" />
            新建词条
          </MinecraftButtonClassic>
          <MinecraftButtonClassic
            v-if="activeTab === 'item'"
            @click="startNewItem"
          >
            <PlusIcon style="width: 1rem; height: 1rem; margin-right: 0.25rem" />
            新建物品
          </MinecraftButtonClassic>
        </div>
      </div>

      <div v-if="activeTab === 'glossary' && glossaryList.length === 0" class="management-empty-state">
        <strong>暂无词条</strong>
        <span>点击"新建词条"添加第一个百科词条</span>
      </div>

      <div v-if="activeTab === 'item' && itemList.length === 0" class="management-empty-state">
        <strong>暂无物品</strong>
        <span>点击"新建物品"添加第一个百科物品</span>
      </div>

      <div v-if="activeTab === 'glossary' && glossaryList.length > 0" class="wiki-table-wrap">
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in glossaryList" :key="entry.id">
              <td>{{ entry.name }}</td>
              <td>{{ entry.type || '-' }}</td>
              <td class="wiki-table-actions">
                <MinecraftButton @click="startEditGlossary(entry)">编辑</MinecraftButton>
                <MinecraftButton dark @click="confirmDeleteGlossary(entry)">删除</MinecraftButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTab === 'item' && itemList.length > 0" class="wiki-table-wrap">
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>最大堆叠</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in itemList" :key="entry.id">
              <td>{{ entry.name }}</td>
              <td>{{ entry.type || '-' }}</td>
              <td>{{ entry.maxStack }}</td>
              <td class="wiki-table-actions">
                <MinecraftButton @click="startEditItem(entry)">编辑</MinecraftButton>
                <MinecraftButton dark @click="confirmDeleteItem(entry)">删除</MinecraftButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <MinecraftDialog
      v-model="deleteDialogVisible"
      title="确认删除"
      @confirm="activeTab === 'glossary' ? doDeleteGlossary() : doDeleteItem()"
    >
      <p>确定要删除「{{ pendingDeleteName }}」吗？此操作不可撤销。</p>
    </MinecraftDialog>
  </template>
</template>

<style lang="css" scoped>
.wiki-admin-tabs {
  display: flex;
  gap: 0.5rem;
}

.wiki-admin-tab {
  padding: 0.5rem 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(0, 0, 0, 0.4);
  border: 2px solid #555;
  font: inherit;
  cursor: pointer;
  user-select: none;
}

.wiki-admin-tab:hover {
  border-color: var(--minecraft-green-light);
  color: #fff;
}

.wiki-admin-tab.active {
  color: #fff;
  background-color: rgba(60, 133, 39, 0.35);
  border-color: var(--minecraft-green-light);
}

.wiki-admin-tab:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.wiki-edit-section {
  margin-bottom: 100vh;
}

.wiki-editor-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.wiki-editor-toggle {
  font-size: 1.1rem;
  width: 6rem;
}

.wiki-preview-area {
  padding: 1.25rem;
  background-color: rgba(0, 0, 0, 0.24);
  border: 2px solid #111;
  min-height: 20rem;
}

.wiki-table-wrap {
  overflow-x: auto;
}

.wiki-table-wrap table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.wiki-table-wrap th,
.wiki-table-wrap td {
  padding: 0.6rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  user-select: none;
}

.wiki-table-wrap th {
  color: var(--minecraft-green-light);
  font-size: 0.9rem;
}

.wiki-table-wrap td {
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.95rem;
}

.wiki-table-actions {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
}

.wiki-type-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.wiki-type-btn {
  font-size: 1rem;
  width: 5rem;
}

.gallery-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-start;
}

.gallery-thumb {
  position: relative;
  width: 6rem;
  height: 6rem;
  border: 2px solid #555;
  background-color: rgba(0, 0, 0, 0.3);
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.gallery-remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 1.4rem;
  height: 1.4rem;
  padding: 0;
  border: 1px solid #c44;
  background-color: #400;
  color: #f66;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-remove-btn:hover {
  background-color: #600;
  color: #faa;
}

.gallery-add-btn {
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #666;
  background-color: rgba(255, 255, 255, 0.05);
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gallery-add-btn:hover {
  border-color: var(--minecraft-green-light);
  color: var(--minecraft-green-light);
  background-color: rgba(60, 133, 39, 0.1);
}

.gallery-add-btn:focus-visible,
.gallery-remove-btn:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.item-image-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-image-preview {
  width: 6rem;
  height: 6rem;
  border: 2px solid #555;
  background-color: rgba(0, 0, 0, 0.3);
}

.item-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.recipe-grid-editor {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.recipe-grid-outer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background-color: #555;
  border: 2px solid #555;
  width: 20rem;
  height: 20rem;
}

.recipe-slot-editor {
  background-color: #8b8b8b;
  border-top: 3px solid #373737;
  border-left: 3px solid #373737;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-slot-input {
  width: 90%;
  padding: 2px;
  border: 1px solid #555;
  background-color: #6b6b6b;
  color: #ffffff;
  font-size: 0.65rem;
  text-align: center;
  outline: none;
}

.recipe-slot-input:focus {
  border-color: #000;
  background-color: #aaa;
}

.recipe-arrow {
  font-size: 1.5rem;
  color: #aaa;
  user-select: none;
}

.recipe-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.recipe-result-img {
  width: 4rem;
  height: 4rem;
  border: 2px solid #555;
  background-color: rgba(0, 0, 0, 0.3);
}

.recipe-result-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.recipe-result-empty {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #555;
  color: #666;
  font-size: 1.2rem;
}

.recipe-result-label {
  color: #fff;
  font-size: 0.9rem;
}
</style>

<style lang="css">
.md-editor-toolbar-wrapper {
  background-color: black;
}

.md-editor-footer {
  background-color: black;
}
</style>
