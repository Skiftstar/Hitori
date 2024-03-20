import { Client, Collection } from "discord.js"

interface Command {
  execute: Function
}

export class BotClient extends Client {
  public commands = new Collection<string, Command>()
}
