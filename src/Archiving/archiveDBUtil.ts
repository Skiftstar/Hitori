import { open } from "sqlite"
import { Database } from "sqlite3"
import { CategoryInfo, ChannelInfo, MessageInfo } from "./archiveTypes"

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
