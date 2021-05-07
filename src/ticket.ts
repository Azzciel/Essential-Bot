import { Collection, Message, Channel, Role, TextChannel, User, PartialUser } from "discord.js";
import { embedMessage } from './bot'
let numberTickets = 0;
let categoryId: string
export const createTicket = (message: Message, user: User | PartialUser, roles: Collection<string, Role>) => {
    const oldChannel = message.channel;
    // if (!message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category')) {
    //     message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id)
    // } else {
    //     categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    // }
    try {
        categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    } catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id)
    }
    createChannel(message, `ticket ${numberTickets}`, (channel: TextChannel) => {
        channel.setParent(categoryId);
        numberTickets++;
        let str = '';
        roles.each((rol) => {
            str += `${rol}`;
        })
        const title = `ticket ${numberTickets - 1}`
        const description = `${user} viene del canal: ${oldChannel} \n${str}`

        //channel.send(`${user} viene del canal: ${oldChannel} \n${str}`);//escribe el nombre del canal del ticket en el nuevo canal
        channel.send(embedMessage(title, description, '').setFooter(str))
    })
}
export const createChannel = (message: Message, name: string, callback: Function) => {
    message.guild.channels.create(name)
        .then((channel: Channel) => callback(channel))
        .catch(err => console.log(err))
}
