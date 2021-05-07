import { Schema, model, Model, Document } from "mongoose";

export interface ITicket extends Document {
    MessageID: string,
    GuildID: string,
    TicketNumber: number,
    WhitelistedRole: string
}

export const TicketSchema: Schema = new Schema({
    MessageID: String,
    GuildID: String,
    TicketNumber: Number,
    WhitelistedRole: String
});

export const Ticket: Model<ITicket> = model('tickets', TicketSchema);
