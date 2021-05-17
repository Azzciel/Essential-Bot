import { RunFucntion } from "../Interfaces/Event";
import { PREFIX } from "./Message";

export const run: RunFucntion = async (client) => {
    console.log(`${client.user.username} has logged in.`);
}
export const name: string = 'ready'
