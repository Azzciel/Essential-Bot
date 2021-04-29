import { Message } from "discord.js";

export function question(message: Message, question: string, callback: (answer:Message) => void)  {
    const user = message.author;
    let answer:Message;
    message.channel.send(question)
        .then(message => {
            const filter = (m:Message) => { return user == m.author; };
            message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] })
                .then(collected => {
                    answer = collected.first();
                    callback(answer);
                    message.delete({ timeout: 5000 });
                })
                .catch(collected => {
                    console.log(`After a minute, only ${collected.size} out of 4 voted.`);
                    message.channel.send('No se escribio una respuesta.')
                });
        })
}