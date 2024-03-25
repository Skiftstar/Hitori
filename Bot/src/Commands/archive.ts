import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { archiveServer } from "../Archiving/archiveUtil"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archive")
    .setDescription("Archives the discord server this command is used in."),
  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId
    if (!guildId) {
      return interaction.reply("This command can only be used in a server.")
    }

    await interaction.reply("Starting Archiving...")

    archiveServer(guildId)
      .then(() => {
        interaction.editReply("Server archived successfully.")
      })
      .catch((error) => {
        interaction.editReply(`Error while archiving server: ${error}`)
      })
  },
}
