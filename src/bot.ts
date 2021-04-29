require('dotenv').config();

import { Client, User, Message, Guild, MessageEmbed, CollectorFilter, Channel } from 'discord.js';
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});
let { PREFIX } = require('../config.json')
import {command} from './commands.js'
import {question} from './question.js'
import {createTicket2} from './ticket.js'

client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`);
});

command(client, 'kick', (message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) return;
    if (args.length === 0) return message.reply('ID required.');
    const member = message.guild.members.cache.get(args[0]);
    if (member) {
        member.kick()
            .then((member) => message.channel.send('The user was kicked.'))
            .catch((err) => message.channel.send('I cannor kick that user.'));
    } else {
        message.channel.send('That member was not found.');
    }
})

command(client, 'clear', (message:Message, args:string[]) => {
    deleteChannels(message.guild,'ticket');
})

command(client,'prefix',(message:Message,args:string[])=>{
    PREFIX=args[0];
    
})

command(client, 'ticket', (message:Message, args:string[]) => {
    question(message, 'Ticket title?', (answer:Message) => {//Titulo
        const titulo = answer.content;
        answer.delete({ timeout: 5000 });
        question(message, 'Ticket description?', (answer) => {//Descripcion
            const description = answer.content;
            answer.delete({ timeout: 5000 });
            question(message, 'Ticket color?', (answer) => {//Color
                const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color = '#00ffff';
                if (hex.test(answer.content)) {
                    color = answer.content;
                }
                question(message, 'Ticket roles?', (answer) => {//Roles
                    const roles = answer.mentions.roles;
                    answer.delete({ timeout: 5000 });
                    message.channel.send(embedMessage(titulo, description, color))
                        .then((message) => {
                            const emoji = '❔';
                            message.react(emoji);
                            client.on('messageReactionAdd',((reaction,user)=>{
                                if (user.bot) return;
                                if(reaction.emoji.name===emoji&&reaction.message===message){
                                    createTicket2(message,user,roles);
                                }
                            }))
                        })
                });
            })
        });
    });
})

const embedMessage = (title:string, description:string, color:string) => {
    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
}

function deleteChannels(guild:Guild,name:string) {
    guild.channels.cache.forEach((channel)=>{
        if(channel.name.startsWith(name)){
            channel.delete();
        }
    })
}
client.login(process.env.DISCORD_BOT_TOKEN);