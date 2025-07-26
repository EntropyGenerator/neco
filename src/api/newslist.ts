export interface NewsEntity {
  id: string
  title: string
  brief: string
  date: string
  image: string
}

export interface AuthorTag {
  text: string
  color: string
  tagColor: string
}

export interface AuthorInfo {
  avatar: string
  name: string
  tags: AuthorTag[]
}

export type NewsSegmentType = 'markdown' | 'pdf_file' | 'doc_file' | 'xls_file' | 'ppt_file'

export interface NewsSegment {
  type: NewsSegmentType
  content: string
}

export interface NewsDetail {
  entity: NewsEntity
  content: NewsSegment[]
  author: AuthorInfo
  category: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GetNewsTotal = async (_target: string) => {
  return new Promise<number>((resolve) => {
    resolve(3389)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GetNews = async (_target: string, _page: number) => {
  return new Promise<NewsEntity[]>((resolve) => {
    resolve([
      {
        id: '1',
        title: '标题1',
        brief: '简介1',
        date: '2022-01-01',
        image:
          'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/screenshots/MCV_FA25_July22_01_Editorial_Exclusive_1920x1080.jpg',
      },
      {
        id: '2',
        title: '标题2',
        brief: '简介2',
        date: '2022-01-02',
        image:
          'https://www.minecraft.net/content/dam/games/minecraft/background-images/pmp-hero-minecraft.jpg',
      },
      {
        id: '3',
        title: '标题3',
        brief: '简介3',
        date: '2022-01-01',
        image:
          'https://www.minecraft.net/content/dam/games/minecraft/background-images/pmp-hero-minecraft.jpg',
      },
      {
        id: '4',
        title: '标题4',
        brief: '简介4',
        date: '2022-01-02',
        image:
          'https://www.minecraft.net/content/dam/games/minecraft/background-images/pmp-hero-minecraft.jpg',
      },
    ])
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GetNewsDetail = async (_id: string) => {
  return new Promise<NewsDetail>((resolve) => {
    resolve({
      entity: {
        id: '1',
        title: '标题1',
        brief: '简介1',
        date: '2022-01-01',
        image: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
      },
      content: [
        {
          type: 'markdown',
          content: '## 标题\n\n正文',
        },
        {
          type: 'pdf_file',
          content:
            'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pdf',
        },
        {
          type: 'ppt_file',
          content:
            'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pptx',
        },
        {
          type: 'xls_file',
          content:
            'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.xlsx',
        },
        {
          type: 'doc_file',
          content:
            'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.docx',
        },
      ],
      author: {
        avatar: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
        name: '作者',
        tags: [
          {
            text: '管理员',
            color: '#E6A23C',
            tagColor: 'rgba(230, 162, 60, 0.1)',
          },
        ],
      },
      category: '资讯',
    })
  })
}

export interface NewsBrief {
  id: string
  image: string
  title: string
  brief: string
}

export const GetNewsBrief = async () => {
  return new Promise<NewsBrief[]>((resolve) => {
    resolve([
      {
        id: '1',
        image:
          'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/screenshots/MCV_FA25_July22_01_Editorial_Exclusive_1920x1080.jpg',
        title: '第 8 届 NFCC 小游戏大赛开赛在即！',
        brief: '【康康你的】第15期活动暨第8届NFCC小游戏派对即将开赛！欢迎大家积极参赛！',
      },
      {
        id: '2',
        image:
          'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/game-characters/hoglin_bento.jpg',
        title: 'NMO动画组创作挑战',
        brief: 'NMO动画组第九届创作挑战——‘战斗,爽!’',
      },
      {
        id: '3',
        image:
          'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Hero-A-1440_Image-ID_Smurfs_DLC_1920x1080_01.jpg',
        title: '📜【NMO社刊第十三期·盛夏启航】',
        brief: '🌞热浪翻涌，方块跃动！NMO社刊携夏日狂欢特辑清凉降临！',
      },
      {
        id: '4',
        image:
          'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/screenshots/endcity-bento.jpg',
        title: '7 月服务器维护时间公告',
        brief: '由于校园网维护，服务器下线',
      },
    ])
  })
}
