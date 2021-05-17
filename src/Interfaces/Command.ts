import { Client, Message, PermissionResolvable } from "discord.js";

export interface RunFucntion {
    (client: Client, message: Message, args: string[]): Promise<void | any>
}

export interface Command {
    name: string,
    args: string,
    description: string,
    category: string,
    run: RunFucntion,
    permissions: PermissionResolvable
}