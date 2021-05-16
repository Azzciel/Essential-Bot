import { Message } from "discord.js";
import { commands } from "../handlers/command_handler";
import { Command } from "../Interfaces/Command";
import { RunFucntion } from "../Interfaces/Event";
import { IPrefix, Prefix } from "../models/prefix";

export let PREFIX: string

export const run: RunFucntion = async (client, message: Message) => {
    const data: IPrefix = await Prefix.findOne({
        GuildID: message.guild.id
    })
    if (data) {
        PREFIX = data.Prefix;
    } else {
        PREFIX = 't.';
    }
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        const command: Command = commands.get(CMD_NAME);
        if (!command) return;
        command.run(client, message, args)
            .catch(
                (error) => {
                    console.log(`Error : ${error}`)
                }
            )
    }
}
export const name: string = 'message'
