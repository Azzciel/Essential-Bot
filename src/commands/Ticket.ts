import { Message, MessageCollector, MessageEmbed, Role, TextChannel } from 'discord.js';
import { RunFucntion } from '../Interfaces/Command';
import { ITicket, Ticket } from '../models/Ticket';

export const name: string = 'ticket'
export const description = 'Create a ticket.'
export let categoryId: string

export const run: RunFucntion = async (client, message, args) => {
    let ticket = await Ticket.findOne({ GuildID: message.guild.id });
    if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You are missing permissions! You must have the **MANAGE_SERVER** permission.');
    }

    const firstEmbed = new MessageEmbed()
        .setTitle('Ticket System Setup')
        .setDescription('What do you want the embed description to be?')
        .setColor('BLUE');
    let firstMsg = await message.channel.send(firstEmbed);

    const firstFilter = (m: Message) => m.author.id === message.author.id;
    const firstCollector = new MessageCollector(<TextChannel>message.channel, firstFilter, { max: 2 });

    let embedDescription: string;

    firstCollector.on('collect', async msg => {
        if (msg.content === 'cancel') {
            const cancelEmbed = new MessageEmbed()
                .setTitle('Ticket System Setup')
                .setDescription('The Ticket System Setup was cancelled.')
                .setColor('RED');
            msg.channel.send(cancelEmbed);
            firstCollector.stop();
            return
        }
        embedDescription = msg.content;
        const secondEmbed = new MessageEmbed()
            .setTitle('Ticket System Setup')
            .setDescription('Where do you want to send the message? Please mention a channel.')
            .setColor('BLUE');
        msg.channel.send(secondEmbed);
        firstCollector.stop();

        const secondFilter = (m: Message) => m.author.id === message.author.id;
        const secondCollector = new MessageCollector(<TextChannel>message.channel, secondFilter, { max: 2 });

        secondCollector.on('collect', async msg => {
            let embedChannel: TextChannel = msg.mentions.channels.first();
            if (!embedChannel) {
                msg.channel.send('That is not a valid channel! Please try again.');
                secondCollector.stop();
                return;
            }

            const thirdEmbed = new MessageEmbed()
                .setTitle('Ticket System Setup')
                .setDescription('What roles do you want to have access to see tickets? Please provide a role name, mention, or ID.')
                .setColor('BLUE');
            msg.channel.send(thirdEmbed);
            secondCollector.stop();

            const thirdFilter = (m: Message) => m.author.id === message.author.id;
            const thirdCollector = new MessageCollector(<TextChannel>message.channel, thirdFilter, { max: 2 });

            thirdCollector.on('collect', async (message: Message) => {
                let savedRole: Role = message.mentions.roles.first() || message.guild.roles.cache.get(message.content) || message.guild.roles.cache.find((role: Role) => role.name.toLowerCase() === message.content.toLowerCase());

                if (!savedRole) {
                    msg.channel.send('That is not a valid role! Please try again.');
                    thirdCollector.stop();
                    return;
                }

                const fourthEmbed = new MessageEmbed()
                    .setTitle('Ticket System Setup')
                    .setDescription('The setup is now finished!')
                    .setColor('BLUE');
                await msg.channel.send(fourthEmbed);
                thirdCollector.stop();

                await createTicketSystem(ticket, embedDescription, embedChannel, message, savedRole).catch(err => { console.log(err) })
            });
        });
    });
    try {
        categoryId = message.guild.channels.cache.find(c => c.name == 'Tickets' && c.type == 'category').id
    } catch (error) {
        message.guild.channels.create('Tickets', { type: 'category' }).then(msg => categoryId = msg.id);
    }
}

const createTicketSystem = async (ticket: ITicket, embedDescription: string, embedChannel: TextChannel, message: Message, savedRole: Role) => {
    const sendEmbed = new MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('BLUE');

    let msg = await embedChannel.send(sendEmbed);
    await msg.react('🎟');

    const newData = new Ticket({
        CategoryID: categoryId,
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();

    await message.guild.channels.cache.get(categoryId).overwritePermissions([{
        id: message.guild.id,
        deny: ['VIEW_CHANNEL']
    }])
}