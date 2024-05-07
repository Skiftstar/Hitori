import {
  EmbedBuilder,
  TextChannel,
  ChatInputCommandInteraction,
  ChannelType,
  BaseGuildTextChannel,
  GuildTextBasedChannel,
} from "discord.js"
import { getConfigValue } from "../Config/config"
import { client } from ".."

export const startBot = () => {
  client.login(getConfigValue("token"))
}

export const sendMessage = (channel: TextChannel, message: string) => {
  channel.send(message)
}

export const replyEmbed = (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder
) => {
  interaction.reply({ embeds: [embed] })
}

export const bulkDelete = (channel: TextChannel) => {
  if (channel === undefined) {
    return sendError(`BulkDelete: Channel is undefined`)
  }
  channel.bulkDelete(20).catch((error) => {
    sendError(error)
  })
}

export const sendError = (error: string, additionalData?: any) => {
  console.log(error, additionalData)
}

export const sendEmbed = (channel: TextChannel, embed: EmbedBuilder) => {
  if (channel === undefined) {
    return sendError("sendEmbed: Channel undefined")
  }
  channel.send({ embeds: [embed] }).catch((err) => {
    sendError("Error while sending embed, see logs", err)
  })
}

export const getChannelById = (channelId: string) => {
  const guildId = getConfigValue("guildId")

  return client.guilds.cache
    .get(guildId)
    ?.channels.cache.get(channelId) as TextChannel
}

export const getChannelsOfGuild = async (guildId: string) => {
  const guild = client.guilds.cache.get(guildId)

  const channels = Array.from(guild?.channels.cache.values() || [])
  let archivedThreadChannels: GuildTextBasedChannel[] = []

  // We need to fetch archived threads separately, because Discord...
  for (const channel of channels) {
    if (!(channel.type === ChannelType.GuildText)) continue

    const textChannel = channel as BaseGuildTextChannel

    const archivedThreads = await textChannel.threads.fetchArchived({
      fetchAll: true,
    })
    archivedThreadChannels.push(...Array.from(archivedThreads.threads.values()))
  }

  return [...channels, ...archivedThreadChannels]
}

export const getGuild = (guildId: string) => {
  return client.guilds.cache.get(guildId)
}

export const getUsersOfGuild = (guildId: string) => {
  const guild = client.guilds.cache.get(guildId)
  return Array.from(guild?.members.cache.values() || [])
}
