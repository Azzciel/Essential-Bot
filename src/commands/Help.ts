import { EmbedField, EmbedFieldData, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { PREFIX } from '../events/Message';
import { commands } from '../handlers/command_handler';
import { RunFucntion } from '../Interfaces/Command';

export const name: string = 'help'
export const description = 'Shows all available bot commands..'
export const args = ''

export const run: RunFucntion = (client, message, args) => {

    const roleColor =
        message.guild.me.displayHexColor === "#000000"
            ? "#ffffff"
            : message.guild.me.displayHexColor;

    if (!args[0]) {
        //let categories = [];
        //const command_files: string[] = readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'))
        //readdirSync("./commands/").forEach((dir) => {
        // const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        //     file.endsWith(".js")
        // );
        const command_files: string[] = readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'))
        const cmds = command_files.map((value) => {
            //let file = require(`../../commands/${dir}/${command}`);
            let file = require(`${__dirname}/../commands/${value}`);
            if (!file.name) return "No command name.";
            if (file.category) return
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
        const embed = new MessageEmbed()
            .setTitle("📬 Need help? Here are all of my commands:")
            .addField('Commands', cmds.length === 0 ? "In progress." : cmds.join(" "))
            .setDescription(
                `Use \`${PREFIX}help\` followed by a command name to get more additional information on a command. For example: \`${PREFIX}help ban\`.`
            )
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setColor(roleColor);
        return message.channel.send(embed);
    } else {
        const command =
            commands.get(args[0].toLowerCase()) //||
        // commands.find(
        //     (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        // );

        if (!command) {
            const embed = new MessageEmbed()
                .setTitle(`Invalid command! Use \`${PREFIX}help\` for all of my commands!`)
                .setColor("FF0000");
            return message.channel.send(embed);
        }

        const embed = new MessageEmbed()
            .setTitle("Command Details:")
            .addField("PREFIX:", `\`${PREFIX}\``)
            .addField(
                "COMMAND:",
                command.name ? `\`${command.name}\`` : "No name for this command."
            )
            // .addField(
            //     "ALIASES:",
            //     command.aliases
            //         ? `\`${command.aliases.join("` `")}\``
            //         : "No aliases for this command."
            // )
            .addField(
                "USAGE:",
                command.args
                    ? `\`${PREFIX}${command.name} ${command.args}\``
                    : `\`${PREFIX}${command.name}\``
            )
            .addField(
                "DESCRIPTION:",
                command.description
                    ? command.description
                    : "No description for this command."
            )
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setColor(roleColor);
        return message.channel.send(embed);
    }
}