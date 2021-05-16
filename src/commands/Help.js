"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.args = exports.description = exports.name = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const Message_1 = require("../events/Message");
const command_handler_1 = require("../handlers/command_handler");
exports.name = 'help';
exports.description = 'Shows all available bot commands..';
exports.args = '';
const run = (client, message, args) => {
    const roleColor = message.guild.me.displayHexColor === "#000000"
        ? "#ffffff"
        : message.guild.me.displayHexColor;
    if (!args[0]) {
        //let categories = [];
        //const command_files: string[] = readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'))
        //readdirSync("./commands/").forEach((dir) => {
        // const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        //     file.endsWith(".js")
        // );
        const command_files = fs_1.readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'));
        const cmds = command_files.map((value) => {
            //let file = require(`../../commands/${dir}/${command}`);
            let file = require(`${__dirname}/../commands/${value}`);
            if (!file.name)
                return "No command name.";
            if (file.category)
                return;
            let name = file.name.replace(".js", "");
            return `\n\`${name}\``;
        });
        //let data: Object;
        // data = {
        //     name: '',
        //     value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        // };
        //categories.push(data);
        //});
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("📬 Need help? Here are all of my commands:")
            .addField('Commands', cmds.length === 0 ? "In progress." : cmds.join(" "))
            .setDescription(`Use \`${Message_1.PREFIX}help\` followed by a command name to get more additional information on a command. For example: \`${Message_1.PREFIX}help ban\`.`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(roleColor);
        return message.channel.send(embed);
    }
    else {
        const command = command_handler_1.commands.get(args[0].toLowerCase()); //||
        // commands.find(
        //     (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        // );
        if (!command) {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Invalid command! Use \`${Message_1.PREFIX}help\` for all of my commands!`)
                .setColor("FF0000");
            return message.channel.send(embed);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Command Details:")
            .addField("PREFIX:", `\`${Message_1.PREFIX}\``)
            .addField("COMMAND:", command.name ? `\`${command.name}\`` : "No name for this command.")
            // .addField(
            //     "ALIASES:",
            //     command.aliases
            //         ? `\`${command.aliases.join("` `")}\``
            //         : "No aliases for this command."
            // )
            .addField("USAGE:", command.args
            ? `\`${Message_1.PREFIX}${command.name} ${command.args}\``
            : `\`${Message_1.PREFIX}${command.name}\``)
            .addField("DESCRIPTION:", command.description
            ? command.description
            : "No description for this command.")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(roleColor);
        return message.channel.send(embed);
    }
};
exports.run = run;
