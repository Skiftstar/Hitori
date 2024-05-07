import {
  ChannelType,
  Collection,
  DiscordAPIError,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  TextChannel,
  ThreadChannel,
  User,
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
  SERVER_LIST_DB_NAME,
  ServerInfo,
  ThreadInfo,
  UserInfo,
  SERVER_ARCHIVE_FOLDER_NAME,
} from "./archiveTypes"
import {
  insertCategories,
  insertChannels,
  insertMedia,
  insertMessages,
  insertServerInfo,
  insertThreads,
  insertUsers,
} from "./archiveDBUtil"
import { get } from "https"
import { getConfigValue } from "../Config/config"

export const archiveServer = async (guildId: string) => {
  const guild = getGuild(guildId)
  if (!guild) throw new Error("Guild not found")

  const channelsOnGuild = await getChannelsOfGuild(guildId)
  if (channelsOnGuild.length === 0)
    throw new Error("No channels found on guild")

  const textChannels = channelsOnGuild.filter(
    (channel) => channel.type === ChannelType.GuildText
  )
  const categories = channelsOnGuild.filter(
    (channel) => channel.type === ChannelType.GuildCategory
  )
  const threads = channelsOnGuild.filter((channel) => channel.isThread())

  const guildMembers = getUsersOfGuild(guildId)

  const dbName = `${SERVER_ARCHIVE_FOLDER_NAME}/${guild.name}-${guild.id}.db`
  // Wheter or not to download media for the database
  const storeMediaLocally = getConfigValue("storeMediaLocally")

  // Create DB for Server
  await createDatabase(
    dbName,
    "./config/Archiving/archive_database_scheme.sql"
  ).catch((error) => {
    throw new Error(`Error while creating database: ${error}`)
  })

  // Create DB for Server List if not exists
  await createDatabase(
    SERVER_LIST_DB_NAME,
    "./config/Archiving/archive_server_listdatabase_scheme.sql"
  ).catch((error) => {
    throw new Error(`Error while creating database: ${error}`)
  })

  await archiveServerInfo(guild, SERVER_LIST_DB_NAME, storeMediaLocally)
  await archiveCategories(categories, dbName)
  await archiveChannels(textChannels, dbName)

  // Users that left the server but still have messages in it
  const leftUsers: Set<User> = new Set()

  for (const channel of textChannels) {
    await archiveMessages(
      channel as TextChannel,
      dbName,
      storeMediaLocally,
      leftUsers
    )
    console.log("archived channel", channel.name)
  }

  for (const channel of threads) {
    await archiveMessages(
      channel as ThreadChannel,
      dbName,
      storeMediaLocally,
      leftUsers
    )
  }

  await archiveThreads(threads as ThreadChannel[], dbName)
  await archiveUsers(guildMembers, dbName, storeMediaLocally)
  await archiveLeftUsers(Array.from(leftUsers), dbName, storeMediaLocally)
}

const archiveServerInfo = async (
  guild: Guild,
  dbName: string,
  storeMediaLocally: boolean
) => {
  const iconData = storeMediaLocally
    ? await downloadMedia(
        guild.iconURL({ size: 1024, forceStatic: false }) || null
      )
    : null

  const serverInfo: ServerInfo = {
    id: guild.id,
    serverName: guild.name,
    serverIconURL: guild.iconURL() || "",
    serverIconData: iconData,
    created: guild.createdTimestamp,
  }

  await insertServerInfo(serverInfo, dbName)
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

const archiveUsers = async (
  users: GuildMember[],
  dbName: string,
  storeMediaLocally: boolean
) => {
  const userInfos: UserInfo[] = []

  await Promise.all(
    users.map(async (user) => {
      const avatarData = storeMediaLocally
        ? await downloadMedia(user.user.avatarURL() || null)
        : null
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

const archiveLeftUsers = async (
  users: User[],
  dbName: string,
  storeMediaLocally: boolean
) => {
  const userInfos: UserInfo[] = []

  await Promise.all(
    users.map(async (user: User) => {
      const avatarData = storeMediaLocally
        ? await downloadMedia(user.avatarURL() || null)
        : null
      userInfos.push({
        id: user.id,
        displayName: user.username,
        username: user.username,
        discriminator: user.discriminator,
        avatarURL: user.avatarURL() || "",
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
  dbName: string,
  storeMediaLocally: boolean,
  users: Set<User>
) => {
  const messageInfos: MessageInfo[] = []
  const mediaInfos: MediaInfo[] = []

  let allMessages: Message[] = []
  let lastId

  while (true) {
    try {
      const options: any = { limit: 100 }
      if (lastId) {
        options.before = lastId
      }

      const messages: any = await channel.messages.fetch(options)

      allMessages = allMessages.concat(Array.from(messages.values()))
      const lastMessage = messages.last()

      if (messages.size !== 100 || !lastMessage) {
        break
      }

      lastId = lastMessage.id
      //TODO: This needs hard testing, currently not working probably
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 429) {
        // Wait for the duration of the rate limit
        const discordError = error as DiscordAPIError
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        // If it's not a rate limit error, rethrow it
        throw error
      }
    }
  }

  await Promise.all(
    allMessages.map(async (message) => {
      if (
        ![...users].some(
          (existingUser) => existingUser.id === message.author.id
        )
      ) {
        users.add(message.author)
      }
      messageInfos.push({
        content: message.content,
        id: message.id,
        channelId: message.channel.id,
        threadId: message.channel.isThread() ? message.channel.id : null,
        userId: message.author.id,
        hasMedia: message.attachments.size > 0,
        timestamp: message.createdTimestamp,
        pinned: message.pinned,
        type: message.type.toString(),
        systemMessage: message.system,
      })

      if (message.attachments.size > 0) {
        const media = await archiveMedia(message, storeMediaLocally)
        mediaInfos.push(...media)
      }
    })
  )

  await insertMessages(messageInfos, dbName)
  await insertMedia(mediaInfos, dbName)
}

const archiveMedia = async (message: Message, storeMediaLocally: boolean) => {
  const mediaInfos: MediaInfo[] = []

  const attachments = Array.from(message.attachments.values())
  await Promise.all(
    attachments.map(async (attachment) => {
      const attachmentData = storeMediaLocally
        ? await downloadMedia(attachment.url)
        : null

      mediaInfos.push({
        id: attachment.id,
        messageId: message.id,
        url: attachment.url,
        title: attachment.name,
        size: attachment.size,
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
