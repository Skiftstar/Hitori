export type CategoryInfos = {
  name: string
  id: string
}[]

export type ChannelInfos = {
  name: string
  id: string
  categoryId: string | null
}[]

export type MessageInfos = {
  content: string | null
  id: string
  threadId: string | null
  userId: string
  timestamp: number
}[]
