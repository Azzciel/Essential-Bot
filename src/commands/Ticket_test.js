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
const bot_1 = require("../bot");
const question_1 = require("../question");
const ticket_1 = require("../ticket");
exports.name = 'testTicket';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.member.permissions.has('ADMINISTRATOR'))
        return;
    question_1.question(message, 'Ticket title?', (answer) => {
        const titulo = answer.content;
        answer.delete({ timeout: 900 });
        question_1.question(message, 'Ticket description?', (answer) => {
            const description = answer.content;
            answer.delete({ timeout: 900 });
            question_1.question(message, 'Ticket color?', (answer) => {
                const hex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color = '#00ffff';
                if (hex.test(answer.content)) {
                    color = answer.content;
                }
                question_1.question(message, 'Ticket roles?', (answer) => {
                    const roles = answer.mentions.roles;
                    answer.delete({ timeout: 900 });
                    message.channel.send(bot_1.embedMessage(titulo, description, color))
                        .then((message) => {
                        const emoji = '❔';
                        message.react(emoji);
                        client.on('messageReactionAdd', ((reaction, user) => {
                            if (user.bot)
                                return;
                            if (reaction.emoji.name === emoji && reaction.message === message) {
                                ticket_1.createTicket(message, user, roles);
                            }
                        }));
                    });
                });
            });
        });
    });
});
exports.run = run;
