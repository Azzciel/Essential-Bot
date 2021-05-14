
import { RunFucntion } from "../Interfaces/Command";

export const name: string = 'kick'

export const run: RunFucntion = async (client, message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) return;
    if (args.length === 0) return message.reply('ID required.');
    const member = message.guild.members.cache.get(args[0]);
    if (member) {
        member.kick()
            .then((member) => message.channel.send('The user was kicked.'))
            .catch((err) => message.channel.send('I cannor kick that user.'));
    } else {
        message.channel.send('That member was not found.');
    }
}