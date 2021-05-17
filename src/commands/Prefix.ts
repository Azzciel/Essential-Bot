import { MessageEmbed, PermissionResolvable } from 'discord.js';
import { RunFucntion } from '../Interfaces/Command';
import { IPrefix, Prefix } from '../models/prefix';

export const name: string = 'prefix'
export const description = 'Change the prefix.'
export const args = '<newPrefix>'
export const permissions: PermissionResolvable = 'ADMINISTRATOR'

export const run: RunFucntion = async (client, message, args) => {
    if (!message.member.hasPermission(permissions)) return
    const limite = 3
    if (!args[0]) return; //sin argumentos=> devuelve el prefijo actual
    if ((args[0].length > limite)) return message.channel.send(
        new MessageEmbed().setTitle('Prefix config error')
            .setDescription(`El prefijo no puede tener mas de ${limite} caracteres.`)
            .setColor('RED')
    );
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
    message.channel.send(
        new MessageEmbed().setTitle('Prefix changed.')
            .setDescription(`The new prefix it's ${newData.Prefix}`)
            .setColor('BLUE')
    )
    client.user.setActivity(`${newData.Prefix}help`)
    newData.save();

}