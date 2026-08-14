import { api, BASE_URL } from './api'
import type { NewsSegment } from './newslist'

export interface DocumentNode {
  parendId: string
  id: string
  isFolder: boolean
  private: boolean

  name: string
  contributors?: string[]
  content?: NewsSegment[]
  updateTime?: string
}

export const DeleteDocument = async (targetId: string): Promise<string | null> => {
  let result: string | null = null
  await api
    .delete(`/documents/node/${targetId}`)
    .then((res) => {
      if (res.data.error) {
        result = res.data.error
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        result = err.response.data.error
      }
    })
  return result
}

export const RebindDocument = async (
  targetId: string,
  parentId: string,
): Promise<string | null> => {
  let result: string | null = null
  await api
    .post(`/documents/node/${targetId}`, {
      parentId: parentId,
    })
    .then((res) => {
      if (res.data.error) {
        result = res.data.error
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        result = err.response.data.error
      }
    })
  return result
}

export const RenameDocument = async (targetId: string, name: string): Promise<string | null> => {
  let result: string | null = null
  await api
    .patch(`/documents/node/${targetId}`, {
      name: name,
    })
    .then((res) => {
      if (res.data.error) {
        result = res.data.error
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        result = err.response.data.error
      }
    })
  return result
}

export const UpdateDocument = async (
  targetId: string,
  isPrivate: boolean,
  content: NewsSegment[],
): Promise<string | null> => {
  let result: string | null = null
  await api
    .put(`/documents/node/${targetId}`, {
      private: isPrivate,
      content: content,
    })
    .then((res) => {
      if (res.data.error) {
        result = res.data.error
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        result = err.response.data.error
      }
    })
  return result
}

export interface CreateDocumentForm {
  parentId: string
  isFolder: boolean
  private: boolean
  name: string
}

export const CreateDocument = async (form: CreateDocumentForm): Promise<string | null> => {
  let result: string | null = null
  await api
    .post(`/documents/node`, form)
    .then((res) => {
      if (res.data.id) {
        result = res.data.id
      }
    })
    .catch(() => {})
  return result
}

// 只有 admin / document_admin 才有权访问 private 文档路由；
// 普通登录用户请求 private 路由会得到 403，因此不能仅凭“已登录”切换。
const canReadPrivateDocuments = (): boolean => {
  try {
    const group = JSON.parse(localStorage.getItem('userGroup') || '[]') as string[]
    return group.includes('admin') || group.includes('document_admin')
  } catch {
    return false
  }
}

export const GetDocumentLayer = async (parentId: string): Promise<DocumentNode[]> => {
  const suffix = canReadPrivateDocuments() ? '/private' : ''
  let result: DocumentNode[] = []
  await api
    .get(`/documents/layer${suffix}/${parentId}`)
    .then((res) => {
      result = res.data.children as DocumentNode[]
    })
    .catch(() => {})
  return result
}

export const GetDocumentDetail = async (targetId: string): Promise<DocumentNode | null> => {
  const suffix = canReadPrivateDocuments() ? '/private' : ''
  let result: DocumentNode | null = null
  await api
    .get(`/documents${suffix}/${targetId}`)
    .then((res) => {
      result = res.data as DocumentNode
    })
    .catch(() => {})
  return result
}

export const UploadDocumentFile = async (targetId: string, file: File): Promise<string | null> => {
  let result: string | null = null
  const form = new FormData()
  form.append('file', file)
  await api
    .post(`/documents/upload/${targetId}`, form)
    .then((res) => {
      if (res.data.url) {
        result = BASE_URL + res.data.url
      }
    })
    .catch(() => {})
  return result
}

export const DeleteDocumentFile = async (targetId: string, url: string): Promise<string | null> => {
  let result = null
  await api
    .delete(`/documents/upload/${targetId}`, {
      data: {
        filename: url.split('/').pop(),
      },
    })
    .then((res) => {
      if (res.data.error) {
        result = res.data.error
      }
    })
    .catch((e) => {
      if (e.response.data.error) {
        result = e.response.data.error
      }
    })
  return result
}
