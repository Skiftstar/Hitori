export type CategoryInfo = {
  name: string
  id: string
}

export type ChannelInfo = {
  name: string
  id: string
  categoryId: string | null
}

export type MessageInfo = {
  content: string | null
  id: string
  threadId: string | null
  userId: string
  timestamp: number
}

export type MediaInfo = {
  attachmentId: string,
  messageId: string
  url: string
  type: string
  data: any
}