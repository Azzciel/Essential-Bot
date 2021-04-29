"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    partials: ['MESSAGE', 'REACTION']
});
//const PREFIX = "!";
const { PREFIX } = require('../config.json');
const commands_js_1 = require("./commands.js");
const question_js_1 = require("./question.js");
const ticket_js_1 = require("./ticket.js");
let numberTicket = 0;
let msg;
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
commands_js_1.command(client, 'ticket', (message, args) => {
    question_js_1.question(message, 'Ticket title?', (answer) => {
        const titulo = answer.content;
        answer.delete({ timeout: 5000 });
        question_js_1.question(message, 'Ticket description?', (answer) => {
            const description = answer.content;
            answer.delete({ timeout: 5000 });
            question_js_1.question(message, 'Ticket color?', (answer) => {
                const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color = '#00ffff';
                if (hex.test(answer.content)) {
                    color = answer.content;
                }
                question_js_1.question(message, 'Ticket roles?', (answer) => {
                    const roles = answer.mentions.roles;
                    answer.delete({ timeout: 5000 });
                    message.channel.send(embedMessage(titulo, description, color))
                        .then((message) => {
                        const emoji = '❔';
                        message.react(emoji);
                        client.on('messageReactionAdd', ((reaction, user) => {
                            if (user.bot)
                                return;
                            if (reaction.emoji.name === emoji && reaction.message === message) {
                                ticket_js_1.createTicket2(message, user, roles);
                            }
                        }));
                        msg = message;
                    });
                });
            });
        });
    });
});
const embedMessage = (title, description, color) => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
};
function deleteChannels(guild, name) {
    guild.channels.cache.forEach((channel) => {
        if (channel.name.startsWith(name)) {
            channel.delete();
        }
    });
}
client.login(process.env.DISCORD_BOT_TOKEN);
