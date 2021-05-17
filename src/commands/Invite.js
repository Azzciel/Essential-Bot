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
const bot_1 = require("../bot");
exports.name = 'invite';
exports.description = 'Invite this bot to your server.';
exports.args = '';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    message.channel.send(bot_1.embedMessage('Agregame a tu servidor.', 'Sistema de gestion de tickets de Essential', '#A311E2')
        .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)
        .setThumbnail(client.user.avatarURL()));
});
exports.run = run;
