import { Guild, PermissionResolvable } from 'discord.js';
import { RunFucntion } from '../Interfaces/Command';

export const name: string = 'clear'
export const description = 'Clear all ticket channels.'
export const args = ''
export const category = 'true'
export const permissions: PermissionResolvable = 'ADMINISTRATOR'

export const run: RunFucntion = async (client, message, args) => {
    if (message.author.tag === 'Azzciel#3306') {
        deleteChannels(message.guild, 'ticket');
    }
}

export function deleteChannels(guild: Guild, name: string) {
    guild.channels.cache.forEach((channel) => {
        if (channel.name.startsWith(name)) {
            channel.delete();
        }
    })
}