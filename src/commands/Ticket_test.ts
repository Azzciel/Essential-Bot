import { embedMessage } from '../bot';
import { RunFucntion } from '../Interfaces/Command';
import { question } from '../question';
import { createTicket } from '../ticket';

export const name: string = 'testTicket'

export const run: RunFucntion = async (client, message, args) => {
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

}