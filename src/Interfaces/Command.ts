import { Client, Message } from "discord.js";

export interface RunFucntion {
    (client: Client, message: Message, args: string[]): Promise<void | any>
}

export interface Command {
    name: string,
    category: string,
    run: RunFucntion
}