import { ChannelType, GuildBasedChannel } from "discord.js"
import { getChannelsOfGuild, getGuild } from "../DiscordBot/bot"
import { createDatabase } from "../Database/dbUtil"
import { CategoryInfos, ChannelInfos } from "./archiveTypes"
import { insertCategories, insertChannels } from "./archiveDBUtil"

export const archiveServer = async (guildId: string) => {
  const guild = getGuild(guildId)
  if (!guild) throw new Error("Guild not found")

  const channelsOnGuild = getChannelsOfGuild(guildId)
  if (channelsOnGuild.length === 0)
    throw new Error("No channels found on guild")

  const textChannels = channelsOnGuild.filter(
    (channel) => channel.type === ChannelType.GuildText
  )
  const categories = channelsOnGuild.filter(
    (channel) => channel.type === ChannelType.GuildCategory
  )

  const dbName = `${guild.name}-${guild.id}.db`

  await createDatabase(dbName, "./config/Archiving/archive_database_scheme.sql").catch(
    (error) => {
      throw new Error(`Error while creating database: ${error}`)
    }
  )

  await archiveCategories(categories, dbName)
  await archiveChannels(textChannels, dbName)
}

const archiveCategories = async (
  categories: GuildBasedChannel[],
  dbName: string
) => {
  const categoryInfos: CategoryInfos = []

  categories.forEach((category) => {
    categoryInfos.push({
      name: category.name,
      id: category.id,
    })
  })

  await insertCategories(categoryInfos, dbName)
}

const archiveChannels = async (
  channels: GuildBasedChannel[],
  dbName: string
) => {
  const channelInfos: ChannelInfos = []

  channels.forEach((channel) => {
    channelInfos.push({
      name: channel.name,
      id: channel.id,
      categoryId: channel.parentId,
    })
  })

  await insertChannels(channelInfos, dbName)
}
