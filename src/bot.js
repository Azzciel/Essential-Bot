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
exports.embedMessage = void 0;
require('dotenv').config();
require('./conexion');
require('./ticketSystem');
const discord_js_1 = require("discord.js");
const commands_js_1 = require("./commands.js");
const question_js_1 = require("./question.js");
const ticket_js_1 = require("./ticket.js");
const prefix_1 = require("./models/prefix");
const Ticket_js_1 = require("./models/Ticket.js");
const client = new discord_js_1.Client({
    partials: ['MESSAGE', 'REACTION']
});
client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`);
});
commands_js_1.command(client, 'kick', (message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS'))
        return;
    if (args.length === 0)
        return message.reply('ID required.');
    const member = message.guild.members.cache.get(args[0]);
    if (member) {
        member.kick()
            .then((member) => message.channel.send('The user was kicked.'))
            .catch((err) => message.channel.send('I cannor kick that user.'));
    }
    else {
        message.channel.send('That member was not found.');
    }
});
commands_js_1.command(client, 'clear', (message, args) => {
    deleteChannels(message.guild, 'ticket');
});
commands_js_1.command(client, 'invite', (message, args) => {
    message.channel.send(exports.embedMessage('Agregame a tu servidor.', 'Sistema de gestion de tickets de Essential', '#A311E2')
        .setURL('https://discord.com/oauth2/authorize?client_id=760353718699819049&scope=bot&permissions=8')
        .setThumbnail(client.user.avatarURL()));
});
commands_js_1.command(client, 'prefix', (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const limite = 3;
    if (!args[0])
        return; //sin argumentos=> devuelve el prefijo actual
    if ((args[0].length > limite))
        return message.channel.send(exports.embedMessage('Prefix config error', `El prefijo no puede tener mas de ${limite} caracteres.`));
    const data = yield prefix_1.Prefix.findOne({
        GuildID: message.guild.id
    });
    if (data) {
        yield prefix_1.Prefix.findOneAndRemove({
            GuildID: message.guild.id
        });
    }
    let newData = new prefix_1.Prefix({
        Prefix: args[0],
        GuildID: message.guild.id
    });
    newData.save();
}));
commands_js_1.command(client, 'test', (message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR'))
        return;
    question_js_1.question(message, 'Ticket title?', (answer) => {
        const titulo = answer.content;
        answer.delete({ timeout: 900 });
        question_js_1.question(message, 'Ticket description?', (answer) => {
            const description = answer.content;
            answer.delete({ timeout: 900 });
            question_js_1.question(message, 'Ticket color?', (answer) => {
                const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color = '#00ffff';
                if (hex.test(answer.content)) {
                    color = answer.content;
                }
                question_js_1.question(message, 'Ticket roles?', (answer) => {
                    const roles = answer.mentions.roles;
                    answer.delete({ timeout: 900 });
                    message.channel.send(exports.embedMessage(titulo, description, color))
                        .then((message) => {
                        const emoji = '❔';
                        message.react(emoji);
                        client.on('messageReactionAdd', ((reaction, user) => {
                            if (user.bot)
                                return;
                            if (reaction.emoji.name === emoji && reaction.message === message) {
                                ticket_js_1.createTicket(message, user, roles);
                            }
                        }));
                    });
                });
            });
        });
    });
});
const embedMessage = (title, description, color = '#FFFFFF') => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
};
exports.embedMessage = embedMessage;
function deleteChannels(guild, name) {
    guild.channels.cache.forEach((channel) => {
        if (channel.name.startsWith(name)) {
            channel.delete();
        }
    });
}
commands_js_1.command(client, 'ticket', (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let ticket = yield Ticket_js_1.Ticket.findOne({ GuildID: message.guild.id });
    if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You are missing permissions! You must have the **MANAGE_SERVER** permission.');
    }
    //ticket.MessageID
    //if (!ticket) {
    const firstEmbed = new discord_js_1.MessageEmbed()
        .setTitle('Ticket System Setup')
        .setDescription('What do you want the embed description to be?')
        .setColor('BLUE');
    let firstMsg = yield message.channel.send(firstEmbed);
    const firstFilter = (m) => m.author.id === message.author.id;
    const firstCollector = new discord_js_1.MessageCollector(message.channel, firstFilter, { max: 2 });
    let embedDescription;
    firstCollector.on('collect', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        embedDescription = msg.content;
        const secondEmbed = new discord_js_1.MessageEmbed()
            .setTitle('Ticket System Setup')
            .setDescription('Where do you want to send the message? Please mention a channel.')
            .setColor('BLUE');
        msg.channel.send(secondEmbed);
        firstCollector.stop();
        const secondFilter = (m) => m.author.id === message.author.id;
        const secondCollector = new discord_js_1.MessageCollector(message.channel, secondFilter, { max: 2 });
        secondCollector.on('collect', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            let embedChannel = msg.mentions.channels.first();
            if (!embedChannel) {
                msg.channel.send('That is not a valid channel! Please try again.');
                secondCollector.stop();
                return;
            }
            const thirdEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Ticket System Setup')
                .setDescription('What roles do you want to have access to see tickets? Please provide a role name, mention, or ID.')
                .setColor('BLUE');
            msg.channel.send(thirdEmbed);
            secondCollector.stop();
            const thirdFilter = (m) => m.author.id === message.author.id;
            const thirdCollector = new discord_js_1.MessageCollector(message.channel, thirdFilter, { max: 2 });
            thirdCollector.on('collect', (message) => __awaiter(void 0, void 0, void 0, function* () {
                let savedRole = message.mentions.roles.first() || message.guild.roles.cache.get(message.content) || message.guild.roles.cache.find((role) => role.name.toLowerCase() === message.content.toLowerCase());
                if (!savedRole) {
                    msg.channel.send('That is not a valid role! Please try again.');
                    thirdCollector.stop();
                    return;
                }
                const fourthEmbed = new discord_js_1.MessageEmbed()
                    .setTitle('Ticket System Setup')
                    .setDescription('The setup is now finished!')
                    .setColor('BLUE');
                yield msg.channel.send(fourthEmbed);
                thirdCollector.stop();
                yield createTicketSystem(ticket, embedDescription, embedChannel, message, savedRole).catch(err => { console.log(err); });
            }));
        }));
    }));
    try {
        categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id;
    }
    catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id);
    }
    // } else {
    //     await Ticket.findOneAndRemove({
    //         GuildID: message.guild.id
    //     });
    //     message.channel.send(`**Successfuly Reset the Ticket System on your Server!**\npls use this command again to re-setup!`);
    // }
}));
const createTicketSystem = (ticket, embedDescription, embedChannel, message, savedRole) => __awaiter(void 0, void 0, void 0, function* () {
    const sendEmbed = new discord_js_1.MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('BLUE');
    let msg = yield embedChannel.send(sendEmbed);
    yield msg.react('🎟');
    const newData = new Ticket_js_1.Ticket({
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();
    yield message.guild.channels.cache.get(categoryId).overwritePermissions([{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL']
        }]);
});
class errorMessage extends discord_js_1.MessageEmbed {
    constructor() {
        super();
        this.title = 'Mensaje de error';
        this.description = 'Esta es una prueba.';
        this.setColor('#FD0505');
    }
}
client.login(process.env.DISCORD_BOT_TOKEN);
const cooldown = new Set();
let categoryId;
client.on('messageReactionAdd', (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.bot)
        return;
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.partial)
        yield reaction.fetch();
    if (!reaction.message.guild)
        return;
    const data = yield Ticket_js_1.Ticket.findOne({
        GuildID: reaction.message.guild.id,
        MessageID: reaction.message.id
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
        //
        const oldChannel = reaction.message.channel;
        data.TicketNumber += 1;
        yield data.save();
        const channel = yield reaction.message.guild.channels.create(`ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            type: 'text',
            permissionOverwrites: [{
                    id: reaction.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },],
        });
        yield channel.setParent(categoryId);
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
            .setDescription(`This ticket was created by ${user.toString()} y viene del canal ${oldChannel}. Please say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = yield channel.send(`${user.toString()}, ${channel.guild.roles.cache.get(data.WhitelistedRole)} `, successEmbed);
        yield cooldown.add(user.id);
        yield checkIfClose(client, reaction, user, successMsg, channel);
        yield checkIfTake(user, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
}));
function checkIfClose(bot, reaction, user, successMsg, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (m) => m.content.toLowerCase() === 'done';
        const collector = new discord_js_1.MessageCollector(channel, filter);
        collector.on('collect', (msg) => __awaiter(this, void 0, void 0, function* () {
            channel.send(`This channel will be deleted in ** 10 ** seconds.`);
            yield collector.stop();
            setTimeout(function () {
                channel.delete();
            }, 10000);
        }));
    });
}
function checkIfTake(user, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (m) => m.content.toLowerCase() === 'take';
        const collector = new discord_js_1.MessageCollector(channel, filter);
        collector.on('collect', (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg.author !== user) {
                channel.send(`This ticket was taken by : ${msg.author}`);
                yield collector.stop();
                channel.setName(`${channel.name} take by : ${msg.author.tag}`);
            }
        }));
    });
}
