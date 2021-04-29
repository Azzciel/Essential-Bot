require('dotenv').config();

const { Client, Channel ,Message, Guild, MessageEmbed} = require('discord.js');
const client=new Client({
    partials:['MESSAGE','REACTION']
});
//const PREFIX = "!";
const {PREFIX}=require('../config.json')
import command from './commands.js'
import question from './question'


let numberTicket = 0;
let msg,roles;
client.on('ready',()=>{
    console.log(`${client.user.username} has logged in.`);
});
command(client,'kick',(message,args)=>{
    if(!message.member.hasPermission('KICK_MEMBERS'))return ;
    if(args.length===0)return message.reply('ID required.');
    const member= message.guild.members.cache.get(args[0]);
    if(member){
        member.kick()
        .then((member)=>message.channel.send('The user was kicked.'))
        .catch((err)=>message.channel.send('I cannor kick that user.'));
    }else{
        message.channel.send('That member was not found.');
    }
})

command(client,'clear',(message,args)=>{

})

command(client,'ticket',(message,args)=>{
    question(message,'Ticket title?',(answer)=>{//Titulo
        const titulo=answer.content;
        answer.delete({ timeout: 5000 });
        question(message,'Ticket description?',(answer)=>{//Descripcion
            const description=answer.content;
            answer.delete({ timeout: 5000 });
            question(message,'Ticket color?',(answer)=>{//Color
                const hex =/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                let color='#00ffff';
                if(hex.test(answer.content)){
                    color=answer.content;
                }
                question(message,'Ticket roles?',(answer)=>{//Roles
                    roles=answer.mentions.roles;
                    answer.delete({ timeout: 5000 });
                    message.channel.send(embedMessage(titulo,description,color))
                    .then((message)=>{
                        message.react('❔');
                        msg=message;
                    });
                }); 
            })
        }); 
    });    
})

function newChannel(guild,name) {
    let oldChannel;
    guild.channels.create(name)
    .then((channel)=>{

    })
}

const embedMessage  = (title,description,color)=>{
    const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);
    return embed;
}

function createTicket(message,user) {
    const oldChannel = message.channel;//nombre del canal en el que se crea el ticket
    message.guild.channels.create("ticket-"+numberTicket)//creacion del nuevo canal
        .then((channel)=>{
            numberTicket++;
            let str='';
            roles.each((user)=>{
                //channel.send(`${user}`);
                str+=`${user} `;
            })
            channel.send(`${user} viene del canal: ${oldChannel} \n${str}`);//escribe el nombre del canal del ticket en el nuevo canal
    });
}

function deleteChannel(channel) {
    channel.delete();
}

client.on('messageReactionAdd',(reaction,user)=>{
    if(user.bot)return;
    if(reaction.message===msg){
        createTicket(msg,user);
    }
});

/*
    //roles a mencionar
    canal solo visible para persona que creo y roles mencionados

*/
client.login(process.env.DISCORD_BOT_TOKEN);