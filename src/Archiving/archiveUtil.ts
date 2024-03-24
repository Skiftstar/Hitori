import {
  BaseGuildTextChannel,
  ChannelType,
  GuildBasedChannel,
  Message,
  TextChannel,
} from "discord.js"
import { getChannelsOfGuild, getGuild } from "../DiscordBot/bot"
import { createDatabase } from "../Database/dbUtil"
import {
  CategoryInfo,
  ChannelInfo,
  MediaInfo,
  MessageInfo,
} from "./archiveTypes"
import {
  insertCategories,
  insertChannels,
  insertMedia,
  insertMessages,
} from "./archiveDBUtil"
import { get } from "https"

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

  await createDatabase(
    dbName,
    "./config/Archiving/archive_database_scheme.sql"
  ).catch((error) => {
    throw new Error(`Error while creating database: ${error}`)
  })

  await archiveCategories(categories, dbName)
  await archiveChannels(textChannels, dbName)

  await Promise.all(
    textChannels.map(async (channel) => {
      await archiveMessages(channel as TextChannel, dbName)
    })
  )
}

const archiveCategories = async (
  categories: GuildBasedChannel[],
  dbName: string
) => {
  const categoryInfos: CategoryInfo[] = []

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
  const channelInfos: ChannelInfo[] = []

  channels.forEach((channel) => {
    channelInfos.push({
      name: channel.name,
      id: channel.id,
      categoryId: channel.parentId,
    })
  })

  await insertChannels(channelInfos, dbName)
}

const archiveMessages = async (channel: TextChannel, dbName: string) => {
  const messageInfos: MessageInfo[] = []
  const mediaInfos: MediaInfo[] = []

  const messages = await channel.messages.fetch()

  await Promise.all(
    messages.map(async (message) => {
      messageInfos.push({
        content: message.content,
        id: message.id,
        threadId: message.reference?.messageId || null,
        userId: message.author.id,
        timestamp: message.createdTimestamp,
      })

      if (message.attachments.size > 0) {
        const media = await archiveMedia(message)
        mediaInfos.push(...media)
      }
    })
  )

  await insertMessages(messageInfos, dbName)
  await insertMedia(mediaInfos, dbName)
}

const archiveMedia = async (message: Message) => {
  const mediaInfos: MediaInfo[] = []

  const attachments = Array.from(message.attachments.values())
  await Promise.all(
    attachments.map(async (attachment) => {
      const attachmentData = await downloadMedia(attachment.url)

      mediaInfos.push({
        id: attachment.id,
        messageId: message.id,
        url: attachment.url,
        type: attachment.contentType || "unknown",
        data: attachmentData,
      })
    })
  )

  return mediaInfos
}

const downloadMedia = async (url: string) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []

    get(url, (response) => {
      response.on("data", (chunk) => {
        chunks.push(chunk)
      })

      response.on("end", () => {
        resolve(Buffer.concat(chunks))
      })

      response.on("error", (err) => {
        reject(err)
      })
    })
  })
}
