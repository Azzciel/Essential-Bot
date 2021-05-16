import { Client, Message, MessageCollector, MessageEmbed, MessageReaction, TextChannel, User } from "discord.js";
import { categoryId } from "../commands/Ticket";
import { RunFucntion } from "../Interfaces/Event";
import { ITicket, Ticket } from "../models/Ticket";

export const name: string = 'messageReactionAdd'
let category: string
const cooldown = new Set();

export const run: RunFucntion = async (client, reaction: MessageReaction, user: User) => {
    if (user.bot) return;

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (!reaction.message.guild) return;

    const data: ITicket = await Ticket.findOne({
        GuildID: reaction.message.guild.id,
        MessageID: reaction.message.id
    });
    if (!data) return;//si no existe ticket return
    else {
        try {
            reaction.message.guild.channels.cache.get(data.CategoryID)
            category = data.CategoryID
        } catch (error) {
            reaction.message.guild.channels.create('Tickets', { type: 'category' }).then(msg => { data.CategoryID = msg.id; category = msg.id });
            await data.save();
            console.error(`Este es el error : ${error}`)
        }
    }
    try {
        category = reaction.message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    } catch (error) {
        reaction.message.guild.channels.create('Tickets', { type: 'category' }).then(msg => category = msg.id);
    }
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name === '🎟' && reaction.message.id === data.MessageID) {
        if (cooldown.has(user.id)) {
            reaction.users.remove(user.id);
            return;
        }
        //
        const oldChannel = reaction.message.channel
        data.TicketNumber += 1;
        await data.save();
        const channel = await reaction.message.guild.channels.create(`ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            type: 'text',
            permissionOverwrites: [{
                id: reaction.message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },],
        });
        await channel.setParent(category);
        await channel.createOverwrite(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        await channel.createOverwrite(data.WhitelistedRole, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false
        });
        reaction.users.remove(user.id);

        const successEmbed = new MessageEmbed()
            .setTitle(`Ticket #${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`)
            .setDescription(`This ticket was created by ${user.toString()} from ${oldChannel}.\nSay \`take\` to take this ticket.\nPlease say \`done\` when you're finished.`)
            .setColor('BLUE');
        let successMsg = await channel.send(`${user.toString()}, ${channel.guild.roles.cache.get(data.WhitelistedRole)} `, successEmbed);
        await cooldown.add(user.id);
        await checkIfClose(client, reaction, user, successMsg, channel);
        await checkIfTake(user, channel);
        setTimeout(function () {
            cooldown.delete(user.id);
        }, 300000);
    }
}

async function checkIfClose(bot: Client, reaction: MessageReaction, user: User, successMsg: Message, channel: TextChannel) {
    const filter = (m: Message) => m.content.toLowerCase() === 'done'
    const collector = new MessageCollector(channel, filter);

    collector.on('collect', async msg => {
        channel.send(`This channel will be deleted in ** 10 ** seconds.`);
        await collector.stop();
        setTimeout(function () {
            channel.delete();
        }, 10000);
    });
}
async function checkIfTake(user: User, channel: TextChannel) {
    const filter = (m: Message) => m.content.toLowerCase() === 'take'
    const collector = new MessageCollector(channel, filter);

    collector.on('collect', async (msg: Message) => {
        if (msg.author !== user) {
            channel.send(`This ticket was taken by : ${msg.author}`);
            await collector.stop();
            channel.setName(`${channel.name} take by : ${msg.author.tag}`)
        }
    })
}
