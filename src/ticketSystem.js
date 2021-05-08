"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketSystem = void 0;
const Ticket_1 = require("./models/Ticket");
const discord_js_1 = require("discord.js");
const cooldown = new Set();
module.exports = (bot, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.bot)
        return;
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.partial)
        yield reaction.fetch();
    if (!reaction.message.guild)
        return;
    const data = yield Ticket_1.Ticket.findOne({
        GuildID: reaction.message.guild.id
    });
    if (!data)
        return;
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.emoji.name === '🎟' && reaction.message.id === data.MessageID) {
        if (cooldown.has(user.id)) {
            reaction.users.remove(user.id);
            return;
        }
        data.TicketNumber += 1;
        yield data.save();
        const channel = yield reaction.message.guild.channels.create(`ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            type: 'text',
            permissionOverwrites: [{
                    id: reaction.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },],
        });
        yield channel.createOverwrite(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        yield channel.createOverwrite(data.WhitelistedRole, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        reaction.users.remove(user.id);
        const successEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`Ticket #${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`)
            .setDescription(`This ticket was created by ${user.toString()}. Please say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = yield channel.send(`${user.toString()}`, successEmbed);
        yield cooldown.add(user.id);
        yield checkIfClose(bot, reaction, user, successMsg, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
});
function checkIfClose(bot, reaction, user, successMsg, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (m) => m.content.toLowerCase() === 'done';
        const collector = new discord_js_1.MessageCollector(channel, filter);
        collector.on('collect', (msg) => __awaiter(this, void 0, void 0, function* () {
            channel.send(`This channel will be deleted in **10** seconds.`);
            yield collector.stop();
            setTimeout(function () {
                channel.delete();
            }, 10000);
        }));
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
const createTicketSystem = (ticket, embedDescription, embedChannel, message, savedRole) => __awaiter(void 0, void 0, void 0, function* () {
    const sendEmbed = new discord_js_1.MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('BLUE');
    let msg = yield embedChannel.send(sendEmbed);
    yield msg.react('🎟');
    const newData = new Ticket_1.Ticket({
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();
});
exports.createTicketSystem = createTicketSystem;
