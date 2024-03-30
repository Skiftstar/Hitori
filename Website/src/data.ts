import {
  ArchivedServer,
  Message,
  ServerCategoryChannelResponse,
  User,
  UserMap,
} from "./ServerView/types"

const BASE_URL = "http://localhost:3001"

export const getArchivedServers = async (): Promise<ArchivedServer[]> => {
  const response = await fetch(`${BASE_URL}/archive/servers`)
  const data = await response.json()
  return data
}

export const getServerCategoryChannels = async (
  serverId: string
): Promise<ServerCategoryChannelResponse> => {
  const response = await fetch(`${BASE_URL}/archive/servers/${serverId}`)
  const data = await response.json()
  return data
}

export const getServerUsers = async (serverId: string): Promise<UserMap> => {
  const response = await fetch(`${BASE_URL}/archive/servers/${serverId}/users`)
  const data: User[] = await response.json()
  const userMap: UserMap = data.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {} as UserMap)
  return userMap
}

export const getChannelMessages = async (
  serverId: string,
  channelId: string
): Promise<Message[]> => {
  const response = await fetch(
    `${BASE_URL}/archive/servers/${serverId}/channels/${channelId}`
  )
  const data = await response.json()
  return data
}
