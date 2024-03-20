import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { sendReply } from "../DiscordBot/bot"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archive")
    .setDescription("Archives the discord server this command is used in."),
  async execute(interaction: ChatInputCommandInteraction) {
    return sendReply(interaction, "This command is not yet implemented.")
  },
}
