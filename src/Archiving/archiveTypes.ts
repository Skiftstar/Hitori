export type CategoryInfos = {
  name: string
  id: string
}[]

export type ChannelInfos = {
  name: string
  id: string
  categoryId: string | null
}[]
