import { open } from "sqlite"
import { Database } from "sqlite3"
import {
  CategoryInfo,
  ChannelInfo,
  MediaInfo,
  MessageInfo,
  ServerInfo,
  ThreadInfo,
  UserInfo,
} from "./archiveTypes"

export const insertCategories = async (
  categories: CategoryInfo[],
  dbName: string
) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  categories.forEach((category) => {
    db.run("INSERT OR IGNORE INTO categories (name, id) VALUES (?, ?)", [
      category.name,
      category.id,
    ])
  })

  db.close()
}

export const insertChannels = async (
  channels: ChannelInfo[],
  dbName: string
) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  channels.forEach((channel) => {
    db.run(
      "INSERT OR IGNORE INTO channels (name, id, categoryId) VALUES (?, ?, ?)",
      [channel.name, channel.id, channel.categoryId]
    )
  })

  db.close()
}

export const insertMessages = async (
  messages: MessageInfo[],
  dbName: string
) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  messages.forEach((message) => {
    db.run(
      "INSERT OR IGNORE INTO messages (content, id, channelId, threadId, userId, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      [
        message.content,
        message.id,
        message.channelId,
        message.threadId,
        message.userId,
        message.timestamp,
      ]
    )
  })

  db.close()
}

export const insertMedia = async (media: MediaInfo[], dbName: string) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  media.forEach((mediaInfo) => {
    db.run(
      "INSERT OR IGNORE INTO media (id, messageId, url, type, data) VALUES (?, ?, ?, ?, ?)",
      [
        mediaInfo.id,
        mediaInfo.messageId,
        mediaInfo.url,
        mediaInfo.type,
        mediaInfo.data,
      ]
    )
  })

  db.close()
}

export const insertUsers = async (users: UserInfo[], dbName: string) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  users.forEach((user) => {
    db.run(
      "INSERT OR IGNORE INTO users (id, displayName, username, discriminator, avatarURL, avatarData) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.displayName,
        user.username,
        user.discriminator,
        user.avatarURL,
        user.avatarData,
      ]
    )
  })

  db.close()
}

export const insertThreads = async (threads: ThreadInfo[], dbName: string) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  threads.forEach((thread) => {
    db.run(
      "INSERT OR IGNORE INTO threads (name, id, channelId) VALUES (?, ?, ?)",
      [thread.name, thread.id, thread.channelId]
    )
  })

  db.close()
}

export const insertServerInfo = async (
  serverInfo: ServerInfo,
  dbName: string
) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const date = formatDate(new Date(serverInfo.created))

  await db.run(
    `INSERT INTO Servers (id, serverName, serverIconURL, serverIconData, created) 
     VALUES (?, ?, ?, ?, ?) 
     ON CONFLICT(id) DO UPDATE SET updated = CURRENT_TIMESTAMP`,
    [
      serverInfo.id,
      serverInfo.serverName,
      serverInfo.serverIconURL,
      serverInfo.serverIconData,
      date,
    ]
  )

  await db.close()
}

export const getArchivedServers = async (dbName: string) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  const servers = await db.all("SELECT * FROM Servers")

  db.close()

  return servers
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}