import * as Discord from 'discord.js';
import * as Fs from "fs";
import { Event } from '../Interfaces/Event';
export const events: Discord.Collection<string, Event> = new Discord.Collection()
export default (client: Discord.Client) => {
    const event_files: string[] = Fs.readdirSync(`${__dirname}/../events/`).filter(file => file.endsWith('.js'))
    event_files.map(async (value: string) => {
        const file: Event = await import(`${__dirname}/../events/${value}`)
        events.set(file.name, file)
        client.on(file.name, file.run.bind(null, client))
    })
}