import { Collection, Message,Channel, Role, TextChannel, User, PartialUser } from "discord.js";

let numberTickets=0;
export const createTicket2 = (message:Message, user:User|PartialUser,roles:Collection<string,Role>)=>{
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
export const createChannel=(message:Message,name:string,callback:Function)=>{
    message.guild.channels.create(name)
    .then((channel:Channel)=>callback(channel))
    .catch(err=>console.log(err))
}
