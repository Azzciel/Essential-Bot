import { Client } from "discord.js";

export interface RunFucntion {
    (client: Client, ...args: any[]): Promise<void>
}

export interface Event {
    name: string,
    run: RunFucntion
}