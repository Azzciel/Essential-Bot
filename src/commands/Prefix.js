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
const prefix_1 = require("../models/prefix");
exports.name = 'prefix';
exports.description = 'Change the prefix.';
exports.args = '<newPrefix>';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const limite = 3;
    if (!args[0])
        return; //sin argumentos=> devuelve el prefijo actual
    if ((args[0].length > limite))
        return message.channel.send(bot_1.embedMessage('Prefix config error', `El prefijo no puede tener mas de ${limite} caracteres.`));
    const data = yield prefix_1.Prefix.findOne({
        GuildID: message.guild.id
    });
    if (data) {
        yield prefix_1.Prefix.findOneAndRemove({
            GuildID: message.guild.id
        });
    }
    let newData = new prefix_1.Prefix({
        Prefix: args[0],
        GuildID: message.guild.id
    });
    client.user.setActivity(`${newData.Prefix}help`);
    newData.save();
});
exports.run = run;
