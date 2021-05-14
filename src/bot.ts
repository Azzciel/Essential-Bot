require('dotenv').config();
require('./conexion')
require('./ticketSystem')
import { Client, User, Message, Guild, MessageEmbed, TextChannel, MessageCollector, Role, MessageReaction, Collection } from 'discord.js';
import { command } from './commands.js'
import { question } from './question.js'
import { createTicket } from './ticket.js'
import { Prefix, IPrefix } from './models/prefix'
import { ITicket, Ticket } from './models/Ticket.js';
export const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});
import event_handler from './handlers/event_handler'
import command_handler from './handlers/command_handler'
command_handler(client)
event_handler(client)


let categoryId: string


command(client, 'clear', (message: Message, args: string[]) => {
    if (message.author.tag === 'Azzciel#3306') {
        deleteChannels(message.guild, 'ticket');
    }
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

command(client, 'test', (message: Message, args: string[]) => {
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

command(client, 'ticket', async (message, args) => {
    let ticket = await Ticket.findOne({ GuildID: message.guild.id });
    if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You are missing permissions! You must have the **MANAGE_SERVER** permission.');
    }
    //ticket.MessageID
    //if (!ticket) {
    const firstEmbed = new MessageEmbed()
        .setTitle('Ticket System Setup')
        .setDescription('What do you want the embed description to be?')
        .setColor('BLUE');
    let firstMsg = await message.channel.send(firstEmbed);

    const firstFilter = (m: Message) => m.author.id === message.author.id;
    const firstCollector = new MessageCollector(<TextChannel>message.channel, firstFilter, { max: 2 });

    let embedDescription: string;

    firstCollector.on('collect', async msg => {
        embedDescription = msg.content;
        const secondEmbed = new MessageEmbed()
            .setTitle('Ticket System Setup')
            .setDescription('Where do you want to send the message? Please mention a channel.')
            .setColor('BLUE');
        msg.channel.send(secondEmbed);
        firstCollector.stop();

        const secondFilter = (m: Message) => m.author.id === message.author.id;
        const secondCollector = new MessageCollector(<TextChannel>message.channel, secondFilter, { max: 2 });

        secondCollector.on('collect', async msg => {
            let embedChannel: TextChannel = msg.mentions.channels.first();
            if (!embedChannel) {
                msg.channel.send('That is not a valid channel! Please try again.');
                secondCollector.stop();
                return;
            }

            const thirdEmbed = new MessageEmbed()
                .setTitle('Ticket System Setup')
                .setDescription('What roles do you want to have access to see tickets? Please provide a role name, mention, or ID.')
                .setColor('BLUE');
            msg.channel.send(thirdEmbed);
            secondCollector.stop();

            const thirdFilter = (m: Message) => m.author.id === message.author.id;
            const thirdCollector = new MessageCollector(<TextChannel>message.channel, thirdFilter, { max: 2 });

            thirdCollector.on('collect', async (message: Message) => {
                let savedRole: Role = message.mentions.roles.first() || message.guild.roles.cache.get(message.content) || message.guild.roles.cache.find((role: Role) => role.name.toLowerCase() === message.content.toLowerCase());

                if (!savedRole) {
                    msg.channel.send('That is not a valid role! Please try again.');
                    thirdCollector.stop();
                    return;
                }

                const fourthEmbed = new MessageEmbed()
                    .setTitle('Ticket System Setup')
                    .setDescription('The setup is now finished!')
                    .setColor('BLUE');
                await msg.channel.send(fourthEmbed);
                thirdCollector.stop();

                await createTicketSystem(ticket, embedDescription, embedChannel, message, savedRole).catch(err => { console.log(err) })
            });
        });
    });
    try {
        categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    } catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id);
    }
    // } else {
    //     await Ticket.findOneAndRemove({
    //         GuildID: message.guild.id
    //     });
    //     message.channel.send(`**Successfuly Reset the Ticket System on your Server!**\npls use this command again to re-setup!`);
    // }
})

const createTicketSystem = async (ticket: ITicket, embedDescription: string, embedChannel: TextChannel, message: Message, savedRole: Role) => {
    const sendEmbed = new MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('BLUE');

    let msg = await embedChannel.send(sendEmbed);
    await msg.react('🎟');

    const newData = new Ticket({
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();

    await message.guild.channels.cache.get(categoryId).overwritePermissions([{
        id: message.guild.id,
        deny: ['VIEW_CHANNEL']
    }])
}

class errorMessage extends MessageEmbed {
    constructor() {
        super()
        this.title = 'Mensaje de error'
        this.description = 'Esta es una prueba.'
        this.setColor('#FD0505')
    }
}
client.login(process.env.DISCORD_BOT_TOKEN);
const cooldown = new Set();
client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
    if (user.bot) return;

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (!reaction.message.guild) return;

    const data: ITicket = await Ticket.findOne({
        GuildID: reaction.message.guild.id,
        MessageID: reaction.message.id
    });
    if (!data) return;
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name === '🎟' && reaction.message.id === data.MessageID) {
        if (cooldown.has(user.id)) {
            reaction.users.remove(user.id);
            return;
        }
        //
        const oldChannel = reaction.message.channel
        data.TicketNumber += 1;
        await data.save();
        const channel = await reaction.message.guild.channels.create(`ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            type: 'text',
            permissionOverwrites: [{
                id: reaction.message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },],
        });
        await channel.setParent(categoryId);
        await channel.createOverwrite(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        await channel.createOverwrite(data.WhitelistedRole, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        reaction.users.remove(user.id);

        const successEmbed = new MessageEmbed()
            .setTitle(`Ticket #${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`)
            .setDescription(`This ticket was created by ${user.toString()} y viene del canal ${oldChannel}.Say \`take \` to take this ticket.\n Please say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = await channel.send(`${user.toString()}, ${channel.guild.roles.cache.get(data.WhitelistedRole)} `, successEmbed);
        await cooldown.add(user.id);
        await checkIfClose(client, reaction, user, successMsg, channel);
        await checkIfTake(user, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
}
)
async function checkIfClose(bot: Client, reaction: MessageReaction, user: User, successMsg: Message, channel: TextChannel) {
    const filter = (m: Message) => m.content.toLowerCase() === 'done'
    const collector = new MessageCollector(channel, filter);

    collector.on('collect', async msg => {
        channel.send(`This channel will be deleted in ** 10 ** seconds.`);
        await collector.stop();
        setTimeout(function () {
            channel.delete();
        }, 10000);
    });
}
async function checkIfTake(user: User, channel: TextChannel) {
    const filter = (m: Message) => m.content.toLowerCase() === 'take'
    const collector = new MessageCollector(channel, filter);

    collector.on('collect', async (msg: Message) => {
        if (msg.author !== user) {
            channel.send(`This ticket was taken by : ${msg.author}`);
            await collector.stop();
            channel.setName(`${channel.name} take by : ${msg.author.tag}`)
        }
    })
}