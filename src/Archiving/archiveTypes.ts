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
  channelId: string
  threadId: string | null
  userId: string
  timestamp: number
}

export type MediaInfo = {
  id: string
  messageId: string
  url: string
  type: string
  data: any
}

export type UserInfo = {
  id: string
  displayName: string
  username: string
  discriminator: string
  avatarURL: string
  avatarData: any
}

export type ThreadInfo = {
  name: string
  id: string
  channelId: string | null
}
