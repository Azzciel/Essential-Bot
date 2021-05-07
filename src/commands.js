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
exports.command = void 0;
//import { PREFIX } from './../config.json';
const prefix_1 = require("./models/prefix");
let PREFIX;
function command(client, alias, callback) {
    client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
        const data = yield prefix_1.Prefix.findOne({
            GuildID: message.guild.id
        });
        if (data) {
            PREFIX = data.Prefix;
        }
        else {
            PREFIX = '!';
        }
        if (message.author.bot)
            return;
        if (message.content.startsWith(PREFIX)) {
            const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(PREFIX.length)
                .split(/\s+/);
            if (CMD_NAME === alias) {
                callback(message, args);
            }
        }
    }));
}
exports.command = command;
