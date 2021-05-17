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
exports.deleteChannels = exports.run = exports.category = exports.args = exports.description = exports.name = void 0;
exports.name = 'clear';
exports.description = 'Clear all ticket channels.';
exports.args = '';
exports.category = 'true';
const run = (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.tag === 'Azzciel#3306') {
        deleteChannels(message.guild, 'ticket');
    }
});
exports.run = run;
function deleteChannels(guild, name) {
    guild.channels.cache.forEach((channel) => {
        if (channel.name.startsWith(name)) {
            channel.delete();
        }
    });
}
exports.deleteChannels = deleteChannels;
