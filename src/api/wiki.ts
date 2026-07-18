import { api, BASE_URL } from './api'

export interface GlossaryEntry {
  id: string
  name: string
  type: string
  gallery: string
  content: string
}

export interface ItemEntry {
  id: string
  name: string
  type: string
  image: string
  maxStack: number
  recipe: string
  content: string
}

export const GetGlossaryList = async (): Promise<GlossaryEntry[]> => {
  const resp = await api.get('/wiki/glossary')
  return resp.data.glossaries as GlossaryEntry[]
}

export const GetGlossaryById = async (id: string): Promise<GlossaryEntry> => {
  const resp = await api.get(`/wiki/glossary/${id}`)
  return resp.data as GlossaryEntry
}

export const CreateGlossary = async (entry: Partial<GlossaryEntry>): Promise<string> => {
  const resp = await api.post('/wiki/glossary', entry)
  return resp.data.id as string
}

export const UpdateGlossary = async (id: string, entry: Partial<GlossaryEntry>): Promise<void> => {
  await api.patch(`/wiki/glossary/${id}`, entry)
}

export const DeleteGlossary = async (id: string): Promise<void> => {
  await api.delete(`/wiki/glossary/${id}`)
}

export const GetItemList = async (): Promise<ItemEntry[]> => {
  const resp = await api.get('/wiki/item')
  return resp.data.items as ItemEntry[]
}

export const GetItemById = async (id: string): Promise<ItemEntry> => {
  const resp = await api.get(`/wiki/item/${id}`)
  return resp.data as ItemEntry
}

export const CreateItem = async (entry: Partial<ItemEntry>): Promise<string> => {
  const resp = await api.post('/wiki/item', entry)
  return resp.data.id as string
}

export const UpdateItem = async (id: string, entry: Partial<ItemEntry>): Promise<void> => {
  await api.patch(`/wiki/item/${id}`, entry)
}

export const DeleteItem = async (id: string): Promise<void> => {
  await api.delete(`/wiki/item/${id}`)
}

export const UploadWikiFile = async (id: string, file: File): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  const resp = await api.post(`/wiki/upload/${id}`, form)
  return BASE_URL + (resp.data.url as string)
}

export const DeleteWikiFile = async (id: string, filename: string): Promise<void> => {
  await api.delete(`/wiki/upload/${id}`, { data: { filename } })
}
