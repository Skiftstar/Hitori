import { open } from "sqlite"
import { CategoryInfos, ChannelInfos } from "./archiveTypes"
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
    db.run("INSERT INTO categories (name, id) VALUES (?, ?)", [
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
    db.run("INSERT INTO channels (name, id, categoryId) VALUES (?, ?, ?)", [
      channel.name,
      channel.id,
      channel.categoryId,
    ])
  })

  db.close()
}
