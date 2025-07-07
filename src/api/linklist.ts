export class LinkInfoItem {
    name: string="";
    image: string="";
    url: string="";
    description: string="";
}

export const getLinkList = async (): Promise<LinkInfoItem[]> => {
    return new Promise((resolve) => {
        resolve([
            {
                name: "NMO皮肤站",
                image: "",
                url: "https://skin.nmo.net.cn/",
                description: "TBD"
            },
            {
                name: "NMO文档站",
                image: "",
                url: "https://wiki.nmo.net.cn/",
                description: "TBD"
            },
            {
                name: "bilibili",
                image: "",
                url: "https://space.bilibili.com/646892894",
                description: "TBD"
            }
        ])
    })
}