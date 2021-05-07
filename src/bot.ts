require('dotenv').config();
require('./conexion')
import { Client, User, Message, Guild, MessageEmbed, CollectorFilter, Channel } from 'discord.js';
import { command } from './commands.js'
import { question } from './question.js'
import { createTicket } from './ticket.js'
import { Prefix, IPrefix } from './models/prefix'
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});


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

command(client, 'clear', (message: Message, args: string[]) => {
    deleteChannels(message.guild, 'ticket');
})

command(client, 'invite', (message, args) => {
    message.channel.send(embedMessage('Agregame a tu servidor.', 'Sistema de gestion de tickets de Essential', '#A311E2')
        .setURL('https://discord.com/oauth2/authorize?client_id=760353718699819049&scope=bot&permissions=8')
        .setThumbnail(client.user.avatarURL())
    )
})

command(client, 'prefix', async (message: Message, args: string[]) => {
    const limite = 3
    if (!args[0]) return; //sin argumentos=> devuelve el prefijo actual
    if ((args[0].length > limite)) return message.channel.send(embedMessage('Prefix config error', `El prefijo no puede tener mas de ${limite} caracteres.`));
    const data: IPrefix = await Prefix.findOne({
        GuildID: message.guild.id
    })
    if (data) {
        await Prefix.findOneAndRemove({
            GuildID: message.guild.id
        })
    }
    let newData: IPrefix = new Prefix({
        Prefix: args[0],
        GuildID: message.guild.id
    })
    newData.save();

})

command(client, 'ticket', (message: Message, args: string[]) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return;
    question(message, 'Ticket title?', (answer) => {//Titulo
        const titulo = answer.content;
        answer.delete({ timeout: 900 });
        question(message, 'Ticket description?', (answer) => {//Descripcion
            const description = answer.content;
            answer.delete({ timeout: 900 });
            question(message, 'Ticket color?', (answer) => {//Color
                const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color = '#00ffff';
                if (hex.test(answer.content)) {
                    color = answer.content;
                }
                question(message, 'Ticket roles?', (answer) => {//Roles
                    const roles = answer.mentions.roles;
                    answer.delete({ timeout: 900 });
                    message.channel.send(embedMessage(titulo, description, color))
                        .then((message) => {
                            const emoji = '❔';
                            message.react(emoji);
                            client.on('messageReactionAdd', ((reaction, user) => {
                                if (user.bot) return;
                                if (reaction.emoji.name === emoji && reaction.message === message) {
                                    createTicket(message, user, roles);
                                }
                            }))
                        })
                });
            })
        });
    });
})

export const embedMessage = (title: string, description: string, color: string = '#FFFFFF') => {
    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
}

function deleteChannels(guild: Guild, name: string) {
    guild.channels.cache.forEach((channel) => {
        if (channel.name.startsWith(name)) {
            channel.delete();
        }
    })
}

command(client, 'test', (message, args) => {
    const test = new errorMessage()
    message.channel.send(test)
})

class errorMessage extends MessageEmbed {
    constructor() {
        super()
        this.title = 'Mensaje de error'
        this.description = 'Esta es una prueba.'
        this.setColor('#FD0505')
    }
}
client.login(process.env.DISCORD_BOT_TOKEN);