import { Ticket, ITicket } from './models/Ticket';
import { MessageEmbed, MessageCollector, Client, User, Message, TextChannel, MessageReaction, Role } from 'discord.js';

const cooldown = new Set();

module.exports = async (bot: Client, reaction: MessageReaction, user: User) => {
    if (user.bot) return;

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (!reaction.message.guild) return;

    const data: ITicket = await Ticket.findOne({
        GuildID: reaction.message.guild.id
    });
    if (!data) return;
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name === '🎟' && reaction.message.id === data.MessageID) {
        if (cooldown.has(user.id)) {
            reaction.users.remove(user.id);
            return;
        }
        data.TicketNumber += 1;
        await data.save();
        const channel = await reaction.message.guild.channels.create(`ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            type: 'text',
            permissionOverwrites: [{
                id: reaction.message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },],
        });
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
            .setDescription(`This ticket was created by ${user.toString()}. Please say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = await channel.send(`${user.toString()}`, successEmbed);
        await cooldown.add(user.id);
        await checkIfClose(bot, reaction, user, successMsg, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
}

async function checkIfClose(bot: Client, reaction: MessageReaction, user: User, successMsg: Message, channel: TextChannel) {
    const filter = (m: Message) => m.content.toLowerCase() === 'done'
    const collector = new MessageCollector(channel, filter);

    collector.on('collect', async msg => {
        channel.send(`This channel will be deleted in **10** seconds.`);
        await collector.stop();
        setTimeout(function () {
            channel.delete();
        }, 10000);
    });
}

//Ticket Setup


// export const run = async (bot: Client, message: Message, args: string) => {
//     let ticket = await Ticket.findOne({ GuildID: message.guild.id });
//     if (!message.member.hasPermission('MANAGE_GUILD')) {
//         return message.channel.send('You are missing permissions! You must have the **MANAGE_SERVER** permission.');
//     }

//     if (!ticket) {
//         const firstEmbed = new MessageEmbed()
//             .setTitle('Ticket System Setup')
//             .setDescription('What do you want the embed description to be?')
//             .setColor('BLUE');
//         let firstMsg = await message.channel.send(firstEmbed);

//         const firstFilter = (m: Message) => m.author.id === message.author.id;
//         const firstCollector = new MessageCollector(<TextChannel>message.channel, firstFilter, { max: 2 });

//         let embedDescription: string;

//         firstCollector.on('collect', async msg => {
//             embedDescription = msg.content;
//             const secondEmbed = new MessageEmbed()
//                 .setTitle('Ticket System Setup')
//                 .setDescription('Where do you want to send the message? Please mention a channel.')
//                 .setColor('BLUE');
//             msg.channel.send(secondEmbed);
//             firstCollector.stop();

//             const secondFilter = (m: Message) => m.author.id === message.author.id;
//             const secondCollector = new MessageCollector(<TextChannel>message.channel, secondFilter, { max: 2 });

//             secondCollector.on('collect', async msg => {
//                 let embedChannel = msg.mentions.channels.first();
//                 if (!embedChannel) {
//                     msg.channel.send('That is not a valid channel! Please try again.');
//                     secondCollector.stop();
//                     return;
//                 }

//                 const thirdEmbed = new MessageEmbed()
//                     .setTitle('Ticket System Setup')
//                     .setDescription('What roles do you want to have access to see tickets? Please provide a role name, mention, or ID.')
//                     .setColor('BLUE');
//                 msg.channel.send(thirdEmbed);
//                 secondCollector.stop();

//                 const thirdFilter = (m: Message) => m.author.id === message.author.id;
//                 const thirdCollector = new MessageCollector(<TextChannel>message.channel, thirdFilter, { max: 2 });

//                 thirdCollector.on('collect', async message => {
//                     let savedRole = message.mentions.roles.first() || message.guild.roles.cache.get(message.content) || message.guild.roles.cache.find(role => role.name.toLowerCase() === message.content.toLowerCase());

//                     if (!savedRole) {
//                         msg.channel.send('That is not a valid role! Please try again.');
//                         thirdCollector.stop();
//                         return;
//                     }

//                     const fourthEmbed = new MessageEmbed()
//                         .setTitle('Ticket System Setup')
//                         .setDescription('The setup is now finished!')
//                         .setColor('BLUE');
//                     await msg.channel.send(fourthEmbed);
//                     thirdCollector.stop();

//                     await createTicketSystem(ticket, embedDescription, embedChannel, message, savedRole)
//                 });
//             });
//         });
//     } else {
//         await Ticket.findOneAndRemove({
//             GuildID: message.guild.id
//         });
//         message.channel.send(`**Successfuly Reset the Ticket System on your Server!**\npls use this command again to re-setup!`);
//     }
// }

export const createTicketSystem = async (ticket: ITicket, embedDescription: string, embedChannel: TextChannel, message: Message, savedRole: Role) => {
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
}
