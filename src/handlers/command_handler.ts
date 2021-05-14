import * as Discord from 'discord.js';
import * as Fs from "fs";
import { Command } from '../Interfaces/Command';
export const commands: Discord.Collection<string, Command> = new Discord.Collection()
export default (client: Discord.Client) => {
    const command_files: string[] = Fs.readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'))
    console.log(command_files)
    command_files.map(async (value: string) => {
        const file: Command = await import(`${__dirname}/../commands/${value}`)
        commands.set(file.name, file)
    })
}


