import { Collection, Message, Role, TextChannel, User } from "discord.js";

let numberTickets=0;
const createTicket = (message:Message, user:User,roles:Collection<string,Role>)=>{
    const oldChannel=message.channel;
    createChannel(message,`ticket ${numberTickets}`,(channel:TextChannel)=>{
        numberTickets++;
        let str='';
        roles.each((rol)=>{
            str+=`${rol}`;
        })
        channel.send(`${user} viene del canal: ${oldChannel} \n${str}`);//escribe el nombre del canal del ticket en el nuevo canal
    })
}
const createChannel=(message:Message,name:string,callback:Function)=>{
    message.guild.channels.create(name)
    .then(channel=>callback(channel))
    .catch(err=>console.log(err))
}

export default createTicket;