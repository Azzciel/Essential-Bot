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
exports.run = exports.categoryId = exports.name = void 0;
const discord_js_1 = require("discord.js");
const Ticket_1 = require("../models/Ticket");
exports.name = 'ticket';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let ticket = yield Ticket_1.Ticket.findOne({ GuildID: message.guild.id });
    if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You are missing permissions! You must have the **MANAGE_SERVER** permission.');
    }
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
        exports.categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id;
    }
    catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => exports.categoryId = msg.id);
    }
});
exports.run = run;
const createTicketSystem = (ticket, embedDescription, embedChannel, message, savedRole) => __awaiter(void 0, void 0, void 0, function* () {
    const sendEmbed = new discord_js_1.MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('BLUE');
    let msg = yield embedChannel.send(sendEmbed);
    yield msg.react('🎟');
    const newData = new Ticket_1.Ticket({
        CategoryID: exports.categoryId,
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();
    yield message.guild.channels.cache.get(exports.categoryId).overwritePermissions([{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL']
        }]);
});
