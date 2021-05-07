import { Client, Message } from "discord.js";
//import { PREFIX } from './../config.json';
import { IPrefix, Prefix } from "./models/prefix";

let PREFIX: string
export function command(client: Client, alias: string, callback: (message: Message, args: string[]) => void) {
    client.on('message', async (message) => {
        const data: IPrefix = await Prefix.findOne({
            GuildID: message.guild.id
        })
        if (data) {
            PREFIX = data.Prefix;
        } else {
            PREFIX = '!';
        }
        if (message.author.bot) return;
        if (message.content.startsWith(PREFIX)) {
            const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(PREFIX.length)
                .split(/\s+/);
            if (CMD_NAME === alias) {
                callback(message, args)
            }
        }
    });
}