"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.args = exports.description = exports.name = void 0;
exports.name = 'kick';
exports.description = 'Kick a member.';
exports.args = '<memberID>';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.member.hasPermission('KICK_MEMBERS'))
        return;
    if (args.length === 0)
        return message.reply('ID required.');
    const member = message.guild.members.cache.get(args[0]);
    if (member) {
        member.kick()
            .then((member) => message.channel.send('The user was kicked.'))
            .catch((err) => message.channel.send('I cannor kick that user.'));
    }
    else {
        message.channel.send('That member was not found.');
    }
});
exports.run = run;
