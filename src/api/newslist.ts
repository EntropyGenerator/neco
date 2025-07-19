export interface NewsEntity {
  id: string
  title: string
  content: string
  date: string
  image: string
  author: string
  category: string
}

export interface NewsNavItem {
  name: string
  target: string
}

export const GetNewsNavItems = async (): Promise<NewsNavItem[]> => {
  return new Promise((resolve) => {
    resolve([
      {
        name: '公告',
        target: 'notice'
      },
      {
        name: '社刊',
        target: 'magazine',
      },
      {
        name: '讨论区',
        target: 'discuss',
      }
    ])
  })
}
