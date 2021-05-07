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
const discord_js_1 = require("discord.js");
const commands_js_1 = require("./commands.js");
const question_js_1 = require("./question.js");
const ticket_js_1 = require("./ticket.js");
const prefix_1 = require("./models/prefix");
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
commands_js_1.command(client, 'ticket', (message, args) => {
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
commands_js_1.command(client, 'test', (message, args) => {
    const test = new errorMessage('');
    message.channel.send(test);
});
class errorMessage extends discord_js_1.MessageEmbed {
    constructor(title) {
        super(title);
        this.title = 'Mensaje de error';
        this.description = 'Esta es una prueba.';
        this.setColor('#FD0505');
    }
}
client.login(process.env.DISCORD_BOT_TOKEN);
