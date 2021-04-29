"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannel = exports.createTicket2 = void 0;
let numberTickets = 0;
const createTicket2 = (message, user, roles) => {
    const oldChannel = message.channel;
    exports.createChannel(message, `ticket ${numberTickets}`, (channel) => {
        numberTickets++;
        let str = '';
        roles.each((rol) => {
            str += `${rol}`;
        });
        channel.send(`${user} viene del canal: ${oldChannel} \n${str}`); //escribe el nombre del canal del ticket en el nuevo canal
    });
};
exports.createTicket2 = createTicket2;
const createChannel = (message, name, callback) => {
    message.guild.channels.create(name)
        .then((channel) => callback(channel))
        .catch(err => console.log(err));
};
exports.createChannel = createChannel;
