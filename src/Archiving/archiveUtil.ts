import {
  ChannelType,
  GuildBasedChannel,
  GuildMember,
  Message,
  TextChannel,
  ThreadChannel,
} from "discord.js"
import {
  getChannelsOfGuild,
  getGuild,
  getUsersOfGuild,
} from "../DiscordBot/bot"
import { createDatabase } from "../Database/dbUtil"
import {
  CategoryInfo,
  ChannelInfo,
  MediaInfo,
  MessageInfo,
  ThreadInfo,
  UserInfo,
} from "./archiveTypes"
import {
  insertCategories,
  insertChannels,
  insertMedia,
  insertMessages,
  insertThreads,
  insertUsers,
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
  const threads = channelsOnGuild.filter((channel) => channel.isThread())

  const users = getUsersOfGuild(guildId)

  const dbName = `Archived-Servers/${guild.name}-${guild.id}.db`

  await createDatabase(
    dbName,
    "./config/Archiving/archive_database_scheme.sql"
  ).catch((error) => {
    throw new Error(`Error while creating database: ${error}`)
  })

  await archiveCategories(categories, dbName)
  await archiveChannels(textChannels, dbName)
  await archiveUsers(users, dbName)

  await Promise.all(
    textChannels.map(async (channel: GuildBasedChannel) => {
      await archiveMessages(channel as TextChannel, dbName)
    })
  )

  await Promise.all(
    threads.map(async (channel: GuildBasedChannel) => {
      await archiveMessages(channel as ThreadChannel, dbName)
    })
  )
  await archiveThreads(threads as ThreadChannel[], dbName)
}

const archiveThreads = async (threads: ThreadChannel[], dbName: string) => {
  const threadInfos: ThreadInfo[] = []

  threads.forEach((thread) => {
    threadInfos.push({
      name: thread.name,
      id: thread.id,
      channelId: thread.parentId,
    })
  })

  await insertThreads(threadInfos, dbName)
}

const archiveUsers = async (users: GuildMember[], dbName: string) => {
  const userInfos: UserInfo[] = []

  await Promise.all(
    users.map(async (user) => {
      const avatarData = await downloadMedia(user.user.avatarURL() || null)
      userInfos.push({
        id: user.id,
        displayName: user.displayName,
        username: user.user.username,
        discriminator: user.user.discriminator,
        avatarURL: user.user.avatarURL() || "",
        avatarData: avatarData,
      })
    })
  )

  await insertUsers(userInfos, dbName)
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

const archiveMessages = async (
  channel: TextChannel | ThreadChannel,
  dbName: string
) => {
  const messageInfos: MessageInfo[] = []
  const mediaInfos: MediaInfo[] = []

  const messages = await channel.messages.fetch()

  await Promise.all(
    messages.map(async (message) => {
      messageInfos.push({
        content: message.content,
        id: message.id,
        channelId: message.channel.id,
        threadId: message.channel.isThread() ? message.channel.id : null,
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

const downloadMedia = async (url: string | null) => {
  if (!url) return null
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
