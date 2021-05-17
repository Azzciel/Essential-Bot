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
exports.name = exports.run = exports.PREFIX = void 0;
const command_handler_1 = require("../handlers/command_handler");
const prefix_1 = require("../models/prefix");
const run = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prefix_1.Prefix.findOne({
        GuildID: message.guild.id
    });
    if (data) {
        exports.PREFIX = data.Prefix;
    }
    else {
        exports.PREFIX = 't.';
    }
    yield client.user.setActivity(`${exports.PREFIX}help`);
    if (message.author.bot)
        return;
    if (message.content.startsWith(exports.PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(exports.PREFIX.length)
            .split(/\s+/);
        const command = command_handler_1.commands.get(CMD_NAME);
        if (!command)
            return;
        command.run(client, message, args)
            .catch((error) => {
            console.log(`Error : ${error}`);
        });
    }
});
exports.run = run;
exports.name = 'message';
