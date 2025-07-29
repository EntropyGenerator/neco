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

export type NewsSegmentType = 'markdown' | 'pdf_file' | 'doc_file' | 'xls_file' | 'ppt_file' | 'html'

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
        image: 'https://www.minecraft.net/content/dam/games/minecraft/background-images/pmp-hero-minecraft.jpg',
      },
      content: [
        {
          type: 'markdown',
          content: "" +
                    "---\n" +
                    "title: CPL 引言 / 环境配置\n" +
                    "date: 2025-07-28\n" +
                    "icon: arrow-right-to-bracket\n" +
                    "order: 1\n" +
                    "category:\n" +
                    "  - CPL\n" +
                    "tag:\n" +
                    "  - C Programming Language\n" +
                    "author: Kingcq\n" +
                    "---\n" +
                    "\n" +
                    ":::tip\n" +
                    "这是 CPL DotOJ 补完计划的重制版，目的是更系统、更精确地从零开始介绍 C 语言\n" +
                    "\n" +
                    "如果你更喜欢老版本的青涩风格，也可以前往阅读 [老版本](/posts/CPL-DotOJ-补完计划/0.html)\n" +
                    ":::\n" +
                    "\n" +
                    "引言其实没啥好说的，你不会以为我要讲一讲 C 语言的历史吧？\n" +
                    "\n" +
                    "好吧，那就大概说一下（摘自 [菜鸟教程](https://www.runoob.com/cprogramming/c-tutorial.html)）：\n" +
                    "\n" +
                    "> C 语言是一种通用的、面向过程式的计算机程序设计语言。1972 年，为了移植与开发 UNIX 操作系统，丹尼斯·里奇在贝尔电话实验室设计开发了 C 语言。\n" +
                    "\n" +
                    "> C 语言是一种广泛使用的计算机语言，它与 Java 编程语言一样普及，二者在现代软件程序员之间都得到广泛使用。\n" +
                    "\n" +
                    "那我们要在引言当中干的事其实是先把编程环境配一下\n" +
                    "\n" +
                    ":::warning\n" +
                    "最好保证你的用户名是纯英文不带空格的，否则可能会因为路径不能被命令行正确识别导致一些奇怪的问题！我警告过你了！\n" +
                    ":::\n" +
                    "\n" +
                    "首先是大名鼎鼎的代码编辑器 `vscode`，功能很强，插件生态也很完整，非常推荐！\n" +
                    "\n" +
                    "只需要去 [vscode 官网](https://code.visualstudio.com/Download) 下载对应机器的安装包，自行安装即可\n" +
                    "\n" +
                    ":::tip\n" +
                    "为了保证代码编写的体验，建议安装以下插件：\n" +
                    "- C/C++ 语法高亮\n" +
                    "  - C/C++\n" +
                    "  - C/C++ Extension Pack\n" +
                    "  - C/C++ Themes\n" +
                    "- 代码运行\n" +
                    "  - Code Runner\n" +
                    "- 代码格式化\n" +
                    "  - Prettier - Code formatter\n" +
                    "- 界面主题\n" +
                    "  - Catppuccin for VSCode（这个主题颜色很好看，而且支持生态非常好，真的推荐）\n" +
                    "  - Material Icon Theme（更好看的文件图标）\n" +
                    ":::\n" +
                    "\n" +
                    "如果你会使用 Linux，那你大概也不太需要学习如何配置 C 语言的环境，所以我们主要来讲一下 Windows 和 MacOS 的配置\n" +
                    "\n" +
                    "## Windows\n" +
                    "\n" +
                    ":::tip\n" +
                    "在这里我们只说最简单的方法，只需要使用 `winget` 命令安装即可，这意味着你的 `Windows` 版本需要 `>= 10`\n" +
                    "\n" +
                    "如果你没有 `winget`，那你只能用老办法，从 [Winlibs](https://winlibs.com/)下载对应最新版本的 MinGW，然后将 `bin` 目录添加到环境变量 `PATH` 中\n" +
                    "\n" +
                    "具体步骤可以在网络中搜到，这里就不赘述了\n" +
                    ":::\n" +
                    "\n" +
                    ":::warning\n" +
                    "如果你的 `winget` 卡的一批，那你大概需要更换镜像源，可以前往 [高校联合镜像站 - WinGet 软件仓库索引镜像使用帮助](https://help.mirrors.cernet.edu.cn/winget-source/) 查看具体的配置方法\n" +
                    "\n" +
                    "*如何打开管理员权限的命令行？*\n" +
                    "\n" +
                    "在搜索栏中搜索 `Windows Powershell`，然后右键点击，选择 `以管理员身份运行` 即可\n" +
                    "\n" +
                    "*怎么找到我可能想安装的包？*\n" +
                    "\n" +
                    "在 `Powershell` 中使用 `winget` 搜索即可，例如 `winget search gcc`，它会将包含该内容的匹配全部列出来\n" +
                    "\n" +
                    "*怎么安装？*\n" +
                    "\n" +
                    "如果你已经搜索过，你会发现列出的匹配中有 `ID` 那一列，那就是对应的包名，使用\n" +
                    "\n" +
                    "```powershell\n" +
                    "winget install <ID>\n" +
                    "```\n" +
                    "\n" +
                    "即可安装\n" +
                    "\n" +
                    "*装在哪了？*\n" +
                    "\n" +
                    "`winget` 会默认将软件安装在 C 盘的某个角落，如果你分盘了，那么你的 C 盘的空间可能显得有点小了\n" +
                    "\n" +
                    "那你可以在安装时指定安装路径，例如\n" +
                    "\n" +
                    "```powershell\n" +
                    'winget install <ID> --location "D:\software"\n' +
                    "```\n" +
                    "\n" +
                    "还有一个小技巧，打开文件资源管理器，在左侧选择 `文档 - 属性 - 位置` 可以将文档的存储路径换到别处哦，对于其它同类文件夹也是一样，这样 C 盘空间就省出来了！\n" +
                    ":::\n" +
                    "\n" +
                    "对于 `Windows`，我们直接使用 `winget` 安装，在 `Windows Powershell` 中输入以下命令：\n" +
                    "\n" +
                    "```powershell\n" +
                    "winget install MartinStorsjo.LLVM-MinGW.UCRT\n" +
                    "```\n" +
                    "\n" +
                    "回车运行后，等待安装完成即可\n" +
                    "\n" +
                    "*如何确认安装？*\n" +
                    "\n" +
                    "（安装后需重启命令行）在命令行中输入 `gcc` 并回车\n" +
                    "\n" +
                    "如果安装正确，你应当会看到下面的内容：\n" +
                    "\n" +
                    "```powershell\n" +
                    "gcc.exe: fatal error: no input files\n" +
                    "compilation terminated.\n" +
                    "```\n" +
                    "\n" +
                    "## MacOS\n" +
                    "\n" +
                    "对于 `MacOS`，我们需要使用 `Homebrew` 来安装\n" +
                    "\n" +
                    ":::tip\n" +
                    "*如何安装 Homebrew？*\n" +
                    "\n" +
                    "我们也能参照 [高校联合镜像站 - NJU Homebrew 镜像使用帮助](https://help.mirrors.cernet.edu.cn/homebrew/) 来从镜像源安装和替换 `Homebrew` 的软件仓库\n" +
                    "\n" +
                    "~~或者，你都用 Mac 了，你也许有熟练的手段能快速访问国际上的网络？~~\n" +
                    "\n" +
                    "高校联合镜像站的文档非常详细，我们在这里就不说如何安装 `Homebrew` 了\n" +
                    ":::\n" +
                    "\n" +
                    "那么安装起来也非常简单，在 `Terminal` 中输入以下命令：\n" +
                    "\n" +
                    "```bash\n" +
                    "brew install gcc\n" +
                    "```\n" +
                    "\n" +
                    "回车运行后，等待安装完成即可\n" +
                    "\n" +
                    "*如何确认安装？*\n" +
                    "\n" +
                    "（安装后需重启命令行）在命令行中输入 `gcc` 并回车\n" +
                    "\n" +
                    "如果安装正确，你应当会看到下面的内容：\n" +
                    "\n" +
                    "```bash\n" +
                    "gcc: fatal error: no input files\n" +
                    "compilation terminated.\n" +
                    "```\n",
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
        avatar: 'https://cdn.luogu.com.cn/upload/usericon/75304.png',
        name: 'Kingcq',
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
