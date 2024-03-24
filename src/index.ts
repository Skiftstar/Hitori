import { readdirSync } from "fs"
import path from "path"
import { Collection, GatewayIntentBits } from "discord.js"
import { getConfigValue } from "./Config/config"
import { BotClient } from "./DiscordBot/botClient"
import { REST, Routes } from "discord.js"
import { sendError, startBot } from "./DiscordBot/bot"

export const client = new BotClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] })

const commandFolder = path.join(__dirname, "Commands")
const commandFiles = readdirSync(commandFolder)
client.commands = new Collection()
const commands: any[] = []

for (const file of commandFiles) {
  const command = require(`./Commands/${file}`)
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
  }
}

const token = getConfigValue("token")
const clientId = getConfigValue("clientId")
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token)

// and deploy your commands!
;(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    )

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    })

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()

startBot()

client.on("ready", () => {
  console.log("Bot started!")
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = (interaction.client as BotClient).commands.get(
    interaction.commandName
  )

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  }
})

client.on("error", (error) => {
  sendError(error.name, error.message)
})
