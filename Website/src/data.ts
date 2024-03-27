import { ArchivedServer } from "./ServerView/types"

const BASE_URL = "http://localhost:3001"

export const getArchivedServers= async (): Promise<ArchivedServer[]>  => {
  const response = await fetch(`${BASE_URL}/archive/servers`) // Replace with your API endpoint
  const data = await response.json()
  return data;
}
