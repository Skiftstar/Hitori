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

export type ServerInfo = {
  id: string
  serverName: string
  serverIconURL: string
  serverIconData: any
  created: number
}

export const ARCHIVE_FOLDER_NAME = "Archiving"
export const SERVER_ARCHIVE_FOLDER_NAME = `${ARCHIVE_FOLDER_NAME}/Archived-Servers`
export const SERVER_LIST_DB_NAME = `${ARCHIVE_FOLDER_NAME}/servers.db`
