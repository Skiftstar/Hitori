import {
  EmbedBuilder,
  TextChannel,
  ChatInputCommandInteraction,
  GuildBasedChannel,
} from "discord.js"
import { getConfigValue } from "../Config/config"
import { client } from ".."

export const startBot = () => {
  client.login(getConfigValue("token"))
}

export const sendMessage = (channel: TextChannel, message: string) => {
  channel.send(message)
}

export const sendReply = (
  interaction: ChatInputCommandInteraction,
  reply: string
) => {
  interaction.reply(reply)
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

export const getChannelsOfGuild = (guildId: string) => {
  const guild = client.guilds.cache.get(guildId)

  const channels = Array.from(guild?.channels.cache.values() || [])
  return channels
}

export const getGuild = (guildId: string) => {
  return client.guilds.cache.get(guildId)
}