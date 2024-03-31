export type ArchivedServer = {
  id: string
  serverName: string
  serverIconURL: string
  serverIconData: any
  created: string
  archived: string
  updated: string
}

export type Thread = {
  id: string
  name: string
  channelID: string
}

export type Channel = {
  id: string
  name: string
  categoryID: string
  threads: Thread[]
}

export type Category = {
  id: string
  name: string
  channels: Channel[]
}

export type ServerCategoryChannelResponse = {
  categories: Category[]
  channelsWithoutCategory: Channel[]
}

export type Message = {
  id: string
  content: string
  channelID: string
  threadID: string
  userID: string
  hasMedia: boolean
  timestamp: number
  type: string
  isSystemMessage: boolean
  isPinned: boolean
}

export type User = {
  id: string
  displayName: string
  username: string
  discriminator: string
  avatarURL: string
  avatarData: any
}

export type UserMap = {
  [userId: string]: User
}
