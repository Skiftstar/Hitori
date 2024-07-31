import { open } from "sqlite"
import { Database } from "sqlite3"
import {
  SERVER_ARCHIVE_FOLDER_NAME,
  ServerInfo,
} from "./archiveTypes"
import { doesDatabaseExist } from "../Database/dbUtil"

export const insert = async (dbName: string, tableName: string, dataArray: any[]) => {
	const db = await open({
		filename: dbName,
		driver: Database
	})

	dataArray.forEach(data => {
		const keys = Object.keys(data);
		const values = keys.map(key => data[key]);
		const placeholders = keys.map(() => '?').join(',');
		const query =`INSERT OR IGNORE INTO ${tableName} (${keys.join(',')}) VALUES(${placeholders})`

		db.run(query, [...values])
	})
	db.close()
}

export const getArchivedServers = async (dbName: string) => {
  if (!doesDatabaseExist(dbName)) return []

  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const servers = await db.all("SELECT * FROM Servers")

  db.close()

  return servers
}

export const getServerCategoryChannels = async (dbName: string) => {
  const response = {
    withCategory: {},
    withoutCategory: [],
  }

  if (!doesDatabaseExist(dbName)) return response

  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const categories = await db.all("SELECT * FROM categories")
  const channels = await db.all("SELECT * FROM channels")
  const threads = await db.all("SELECT * FROM threads")
  db.close()

  channels.forEach((channel) => {
    const channelThreads = threads.filter(
      (thread) => thread.channelID === channel.id
    )
    channel.threads = channelThreads
  })

  categories.forEach((category) => {
    const channelsForCategory = channels.filter(
      (channel) => channel.categoryID === category.id
    )
    category.channels = channelsForCategory
  })
  const channelsWithoutCategory = channels.filter(
    (channel) => channel.categoryID === null
  )

  return {
    categories,
    channelsWithoutCategory,
  }
}

export const getServerUsers = async (dbName: string) => {
  if (!doesDatabaseExist(dbName)) return []

  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const users = await db.all("SELECT * FROM users")

  db.close()

  return users
}

export const getChannelMessages = async (
  dbName: string,
  channelId: string,
  isThread: boolean
) => {
  if (!doesDatabaseExist(dbName)) return []

  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const query = isThread
    ? // Make sure to include the first message in the thread with id = channel.id
      //( bc Thread has the same ID as the first message ) as first message is not included by default
      //   "SELECT messages.*, messages.type AS messageType, media.type AS mediaType, media.* FROM messages LEFT JOIN media ON messages.id = media.messageID WHERE messages.threadId = ? OR messages.id = ? IS NULL ORDER BY messages.timestamp ASC"
      // : "SELECT messages.*, messages.type AS messageType, media.type AS mediaType, media.* FROM messages LEFT JOIN media ON messages.id = media.messageID WHERE messages.channelId = ? AND messages.threadID IS NULL ORDER BY messages.timestamp ASC"
      "SELECT * FROM messages WHERE threadID = ? OR id = ? ORDER BY timestamp ASC"
    : "SELECT * FROM messages WHERE channelId = ? AND threadID IS NULL ORDER BY timestamp ASC"

  const messages = await db.all(
    query,
    channelId,
    isThread ? channelId : undefined
  )

  db.close()

  for (const message of messages) {
    if (message.hasMedia) {
      message.media = await getMessageMedia(dbName, message.id)
    } else {
      message.media = []
    }
  }

  return messages
}

export const getMessageMedia = async (dbName: string, messageId: string) => {
  if (!doesDatabaseExist(dbName)) return []

  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const media = await db.all(
    "SELECT * FROM Media WHERE messageID = ?",
    messageId
  )

  const mediaWithBase64Data = media.map((item) => ({
    ...item,
    data: item.data ? item.data.toString("base64") : undefined,
  }))

  db.close()

  return mediaWithBase64Data
}

export const getServerDBName = (server: ServerInfo) => {
  return `${SERVER_ARCHIVE_FOLDER_NAME}/${server.serverName}-${server.id}.db`
}

export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
