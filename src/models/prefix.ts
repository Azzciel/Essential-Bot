import { Schema, model, Model, Document } from "mongoose";

export interface IPrefix extends Document {
    Prefix: string;
    GuildID: string;
}

export const PrefixSchema: Schema = new Schema({
    Prefix: {
        type: String
    },
    GuildID: String
});

export const Prefix: Model<IPrefix> = model('prefixes', PrefixSchema);
