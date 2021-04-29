"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_json_1 = require("./../config.json");
function command(client, alias, callback) {
    client.on('message', (message) => {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(config_json_1.PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME === alias) {
            callback(message, args);
        }
    });
}
exports.command = command;
