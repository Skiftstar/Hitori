import { Channel } from "discord.js";
import { getChannelsOfGuild } from "../DiscordBot/bot";

const getChannelList = async (guildId: string) => {
    return getChannelsOfGuild(guildId);
}