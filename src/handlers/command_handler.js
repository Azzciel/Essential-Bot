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
exports.commands = void 0;
const Discord = require("discord.js");
const Fs = require("fs");
exports.commands = new Discord.Collection();
exports.default = (client) => {
    const command_files = Fs.readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'));
    console.log(command_files);
    command_files.map((value) => __awaiter(void 0, void 0, void 0, function* () {
        const file = yield Promise.resolve().then(() => require(`${__dirname}/../commands/${value}`));
        exports.commands.set(file.name, file);
    }));
};
