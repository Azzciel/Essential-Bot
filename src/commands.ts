import { Client, Message } from "discord.js";

import { PREFIX } from './../config.json';

export function command(client: Client, alias: string, callback:(message:Message,args:string[]) => void){
    client.on('message', (message) => {
        const [CMD_NAME,...args]= message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        if(CMD_NAME===alias){
            callback(message,args)
        }
    });
}