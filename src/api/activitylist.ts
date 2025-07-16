export class ActivityEntity {
  id: string = `` //uuid
  title: string = ``
  content: string = ``
  image: string = `` // base64
  starttime: Date = new Date() // "YYYY-MM-DD"
  endtime: Date = new Date()
}

export const GetActivityList = async (): Promise<ActivityEntity[]> => {
  return new Promise<ActivityEntity[]>((resolve) => {
    resolve([
      {
        id: `0`,
        title: `title1`,
        content: `content1`,
        image: ``,
        starttime: new Date(),
        endtime: new Date(),
      },
    ])
  })
}
