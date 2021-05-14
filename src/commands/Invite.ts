import { embedMessage } from "../bot";
import { RunFucntion } from "../Interfaces/Command";

export const name: string = 'invite'

export const run: RunFucntion = async (client, message, args) => {
    message.channel.send(embedMessage('Agregame a tu servidor.', 'Sistema de gestion de tickets de Essential', '#A311E2')
        .setURL('https://discord.com/oauth2/authorize?client_id=760353718699819049&scope=bot&permissions=8')
        .setThumbnail(client.user.avatarURL())
    )
}