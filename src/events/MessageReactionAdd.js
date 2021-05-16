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
exports.run = exports.name = void 0;
const discord_js_1 = require("discord.js");
const Ticket_1 = require("../models/Ticket");
exports.name = 'messageReactionAdd';
let category;
const cooldown = new Set();
const run = (client, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.bot)
        return;
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.partial)
        yield reaction.fetch();
    if (!reaction.message.guild)
        return;
    const data = yield Ticket_1.Ticket.findOne({
        GuildID: reaction.message.guild.id,
        MessageID: reaction.message.id
    });
    if (!data)
        return; //si no existe ticket return
    else {
        try {
            reaction.message.guild.channels.cache.get(data.CategoryID);
            category = data.CategoryID;
        }
        catch (error) {
            reaction.message.guild.channels.create('Tickets', { type: 'category' }).then(msg => { data.CategoryID = msg.id; category = msg.id; });
            yield data.save();
            console.error(`Este es el error : ${error}`);
        }
    }
    try {
        category = reaction.message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id;
    }
    catch (error) {
        reaction.message.guild.channels.create('Tickets', { type: 'category' }).then(msg => category = msg.id);
    }
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
        yield channel.setParent(category);
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
            .setDescription(`This ticket was created by ${user.toString()} from ${oldChannel}.\nSay \`take\` to take this ticket.\nPlease say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = yield channel.send(`${user.toString()}, ${channel.guild.roles.cache.get(data.WhitelistedRole)} `, successEmbed);
        yield cooldown.add(user.id);
        yield checkIfClose(client, reaction, user, successMsg, channel);
        yield checkIfTake(user, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
});
exports.run = run;
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
