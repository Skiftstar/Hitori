import { ArchivedServer, ServerCategoryChannelResponse } from "./ServerView/types"

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
