import { open } from "sqlite"
import { CategoryInfos, ChannelInfos, MessageInfos } from "./archiveTypes"
import { Database } from "sqlite3"

export const insertCategories = async (
  categories: CategoryInfos,
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
  channels: ChannelInfos,
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
  messages: MessageInfos,
  dbName: string
) => {
  const db = await open({
    filename: dbName,
    driver: Database,
  })

  messages.forEach((message) => {
    db.run(
      "INSERT OR IGNORE INTO messages (content, id, threadId, userId, timestamp) VALUES (?, ?, ?, ?, ?)",
      [
        message.content,
        message.id,
        message.threadId,
        message.userId,
        message.timestamp,
      ]
    )
  })

  db.close()
}
