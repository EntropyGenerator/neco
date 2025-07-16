export const GetSlogan = async () => {
  const slogans: Array<string> = [
    `煤炭 (Coal) 出自《Minecraft》，是可再生资源，收获来自 煤矿石 以及击杀凋灵骷髅有1/3的概率获得1个，可以使用任何 镐 来挖取煤矿石。`,
    `都找着对象了，还愁考不上南京大学？`,
    `都考上南京大学了还愁找不到女朋友？`,
    `哼哼哼，啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊`,
    `我是奶油泡芙 嘿嘿 —— lts098`,
    `爱他 就追随他的脚步 —— lts098`,
    `蒸馍，你不服气？ —— AintCecily`,
    `我是你爹 —— Aircraft`,
    `我觉得穿裙子跑步还挺有意思的 —— Cyber1024`,
    `可以 —— Aircraft（可以）`,
    `天天看个锤子学妹学姐，二次元老婆不香嘛 —— Aircraft`
  ]
  return new Promise<string>((resolve) => {
    resolve(slogans[Math.floor(Math.random() * slogans.length)] ?? slogans[0])
  })
}
