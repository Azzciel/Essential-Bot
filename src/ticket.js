"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannel = exports.createTicket = void 0;
const bot_1 = require("./bot");
let numberTickets = 0;
let categoryId;
const createTicket = (message, user, roles) => {
    const oldChannel = message.channel;
    // if (!message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category')) {
    //     message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id)
    // } else {
    //     categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    // }
    try {
        categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id;
    }
    catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id);
    }
    exports.createChannel(message, `ticket ${numberTickets}`, (channel) => {
        channel.setParent(categoryId);
        numberTickets++;
        let str = '';
        roles.each((rol) => {
            str += `${rol}`;
        });
        const title = `ticket ${numberTickets - 1}`;
        const description = `${user} viene del canal: ${oldChannel} \n${str}`;
        //channel.send(`${user} viene del canal: ${oldChannel} \n${str}`);//escribe el nombre del canal del ticket en el nuevo canal
        channel.send(bot_1.embedMessage(title, description, '').setFooter(str));
    });
};
exports.createTicket = createTicket;
const createChannel = (message, name, callback) => {
    message.guild.channels.create(name)
        .then((channel) => callback(channel))
        .catch(err => console.log(err));
};
exports.createChannel = createChannel;
