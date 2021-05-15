"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedMessage = exports.client = void 0;
require('dotenv').config();
require('./conexion');
require('./ticketSystem');
const event_handler_1 = require("./handlers/event_handler");
const command_handler_1 = require("./handlers/command_handler");
const discord_js_1 = require("discord.js");
exports.client = new discord_js_1.Client({
    partials: ['MESSAGE', 'REACTION']
});
command_handler_1.default(exports.client);
event_handler_1.default(exports.client);
const embedMessage = (title, description, color = '#FFFFFF') => {
    const embed = new discord_js_1.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
    return embed;
};
exports.embedMessage = embedMessage;
exports.client.login(process.env.DISCORD_BOT_TOKEN);
