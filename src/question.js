"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = void 0;
function question(message, question, callback) {
    const user = message.author;
    let answer;
    message.channel.send(question)
        .then(message => {
        const filter = (m) => { return user == m.author; };
        message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] })
            .then(collected => {
            answer = collected.first();
            callback(answer);
            message.delete({ timeout: 5000 });
        })
            .catch(collected => {
            console.log(`After a minute, only ${collected.size} out of 4 voted.`);
            message.channel.send('No se escribio una respuesta.');
        });
    });
}
exports.question = question;
