import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
} from "discord.js"
import { getChannelsOfGuild, sendReply } from "../DiscordBot/bot"
import { archiveServer } from "../Archiving/archiveUtil"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archive")
    .setDescription("Archives the discord server this command is used in."),
  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId
    if (!guildId) {
      return sendReply(
        interaction,
        "This command can only be used in a server."
      )
    }

    archiveServer(guildId)
      .then(() => {
        sendReply(interaction, "Server archived successfully.")
      })
      .catch((error) => {
        sendReply(interaction, `Error while archiving server: ${error}`)
      })
  },
}
