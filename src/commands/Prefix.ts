import { embedMessage } from '../bot';
import { RunFucntion } from '../Interfaces/Command';
import { IPrefix, Prefix } from '../models/prefix';

export const name: string = 'prefix'

export const run: RunFucntion = async (client, message, args) => {
    const limite = 3
    if (!args[0]) return; //sin argumentos=> devuelve el prefijo actual
    if ((args[0].length > limite)) return message.channel.send(embedMessage('Prefix config error', `El prefijo no puede tener mas de ${limite} caracteres.`));
    const data: IPrefix = await Prefix.findOne({
        GuildID: message.guild.id
    })
    if (data) {
        await Prefix.findOneAndRemove({
            GuildID: message.guild.id
        })
    }
    let newData: IPrefix = new Prefix({
        Prefix: args[0],
        GuildID: message.guild.id
    })
    newData.save();

}