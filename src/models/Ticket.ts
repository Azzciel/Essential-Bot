import { Schema, model, Model, Document } from "mongoose";

export interface ITicket extends Document {
    CategoryID: string,
    MessageID: string,
    GuildID: string,
    TicketNumber: number,
    WhitelistedRole: string
}

export const TicketSchema: Schema = new Schema({
    CategoryID: String,
    MessageID: String,
    GuildID: String,
    TicketNumber: Number,
    WhitelistedRole: String
});

export const Ticket: Model<ITicket> = model('tickets', TicketSchema);
