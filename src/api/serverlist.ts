export interface ServerEntity {
  name: string
  description: string
  online: boolean
  playerCount: number
  capacity: number
  icon: string // base64
  onlineMapUrl: string
  serverUrl: string
}

// Static infomation list.
export const getServerList = async (): Promise<ServerEntity[]> => {
  return new Promise((resolve) => {
    resolve([
      {
        name: '群组服',
        description: '包括 原版生存服、建筑服等',
        online: true,
        playerCount: -1,
        capacity: -1,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...==',
        onlineMapUrl: '',
        serverUrl: 'https://mc.nmo.net.cn/',
      } as ServerEntity,
      {
        name: '原版生存服',
        description: '由许多巨型空岛组成的世界',
        online: true,
        playerCount: -1,
        capacity: -1,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...==',
        onlineMapUrl: 'https://map.survival.nmo.net.cn/',
        serverUrl: '',
      } as ServerEntity,
      {
        name: '建筑服',
        description: '各位建筑大佬们自由发挥的地方！',
        online: true,
        playerCount: -1,
        capacity: -1,
        icon: '',
        onlineMapUrl: 'https://map.build.nmo.net.cn/',
        serverUrl: '',
      } as ServerEntity,
      {
        name: '模组一服：飞轮新大陆',
        description: '在全新的大陆上散布飞轮文明的火种吧！',
        online: true,
        playerCount: -1,
        capacity: -1,
        icon: '',
        onlineMapUrl: 'https://map.mod.nmo.net.cn/',
        serverUrl: 'https://mod.nmo.net.cn',
      } as ServerEntity,
      {
        name: '模组三服',
        description: 'TODO模组三服的描述',
        online: true,
        playerCount: -1,
        capacity: -1,
        icon: '',
        onlineMapUrl: 'https://map.modbuild.nmo.net.cn/',
        serverUrl: 'https://modbuild.nmo.net.cn',
      } as ServerEntity,
    ])
  })
}
