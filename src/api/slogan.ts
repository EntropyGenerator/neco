import { api } from "./api"

export const GetSlogan = async (): Promise<string> => {
  let result = "哎呀！与后端失去联系了"
  await api.get("/slogan").then((res) => {
    result = res.data.slogan
  })
  return result
}
