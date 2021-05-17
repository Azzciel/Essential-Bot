require('dotenv').config();
require('./conexion')
import event_handler from './handlers/event_handler'
import command_handler from './handlers/command_handler'
import { Client, MessageEmbed } from 'discord.js';
export const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

command_handler(client)
event_handler(client)

client.login(process.env.DISCORD_BOT_TOKEN);