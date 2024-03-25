import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js"
import { sendReply } from "../DiscordBot/bot"
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

    sendReply(interaction, "Starting Archiving...")

    archiveServer(guildId)
      .then(() => {
        interaction.editReply("Server archived successfully.")
      })
      .catch((error) => {
        interaction.editReply(`Error while archiving server: ${error}`)
      })
  },
}
