import type { UserEntity } from './auth'
import { api } from './api'

export interface DepartmentMember extends UserEntity {
  isLeader: boolean
}

export interface Department {
  id: string
  name: string
  description: string
  icon?: string
  sortOrder: number
  members: DepartmentMember[]
}

const DEFAULT_AVATAR = '/nmo-logo-large.png'

export function toAssetUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith('/contents/')) return `/necore${url}`
  return url
}

export function getMemberAvatar(member: DepartmentMember): string {
  if (member.avatar) return toAssetUrl(member.avatar)

  return DEFAULT_AVATAR
}

export function getMemberTitle(member: DepartmentMember): string {
  if (member.isLeader) return '负责人'
  return member.tags?.[0]?.text ?? ''
}

function readApiError(err: unknown): string | null {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
  ) {
    return (err as { response: { data: { error: string } } }).response.data.error
  }
  return null
}

export async function GetDepartmentList(): Promise<Department[]> {
  let result: Department[] = []
  await api
    .get<{ departments: Department[] }>('/department/')
    .then((res) => {
      result = (res.data.departments ?? [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((department) => ({
          ...department,
          members: (department.members ?? []).map((member) => ({
            ...member,
            isLeader: Boolean(member.isLeader),
          })),
        }))
    })
  return result
}

export async function CreateDepartment(payload: {
  name: string
  description: string
  icon?: string
  sortOrder?: number
}): Promise<{ id: string | null; error: string | null }> {
  let id: string | null = null
  let error: string | null = null
  await api
    .post<{ id?: string; error?: string }>('/department/create', payload)
    .then((res) => {
      if (res.data.error) {
        error = res.data.error
      } else {
        id = res.data.id ?? null
      }
    })
    .catch((err) => {
      error = readApiError(err) || '创建部门失败'
    })
  return { id, error }
}

export async function UpdateDepartment(department: Department): Promise<string | null> {
  let result: string | null = null
  await api
    .patch('/department/', department)
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '保存部门失败'
    })
  return result
}

export async function UpdateDepartmentOrder(
  orders: Array<{ id: string; sortOrder: number }>,
): Promise<string | null> {
  let result: string | null = null
  await api
    .patch('/department/order', { orders })
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '更新部门顺序失败'
    })
  return result
}

export async function DeleteDepartment(id: string): Promise<string | null> {
  let result: string | null = null
  await api
    .delete(`/department/${encodeURIComponent(id)}`)
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '删除部门失败'
    })
  return result
}

export async function AddDepartmentMember(
  departmentId: string,
  username: string,
  sortOrder = 0,
  isLeader = false,
): Promise<string | null> {
  let result: string | null = null
  await api
    .post(`/department/${encodeURIComponent(departmentId)}/member`, {
      username,
      sortOrder,
      isLeader,
    })
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '添加成员失败'
    })
  return result
}

export async function RemoveDepartmentMember(
  departmentId: string,
  username: string,
): Promise<string | null> {
  let result: string | null = null
  await api
    .delete(
      `/department/${encodeURIComponent(departmentId)}/member/${encodeURIComponent(username)}`,
    )
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '移除成员失败'
    })
  return result
}

export async function UpdateDepartmentMemberLeader(
  departmentId: string,
  username: string,
  isLeader: boolean,
): Promise<string | null> {
  let result: string | null = null
  await api
    .patch(
      `/department/${encodeURIComponent(departmentId)}/member/${encodeURIComponent(username)}/leader`,
      { isLeader: Boolean(isLeader) },
    )
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '更新负责人状态失败'
    })
  return result
}

export async function UpdateDepartmentMemberOrder(
  departmentId: string,
  members: Array<{ username: string; sortOrder: number; isLeader: boolean }>,
): Promise<string | null> {
  let result: string | null = null
  await api
    .patch(`/department/${encodeURIComponent(departmentId)}/member/order`, {
      members,
    })
    .then((res) => {
      if (res.data?.error) {
        result = res.data.error as string
      }
    })
    .catch((err) => {
      result = readApiError(err) || '更新成员顺序失败'
    })
  return result
}
