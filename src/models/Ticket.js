"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = exports.TicketSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TicketSchema = new mongoose_1.Schema({
    CategoryID: String,
    MessageID: String,
    GuildID: String,
    TicketNumber: Number,
    WhitelistedRole: String
});
exports.Ticket = mongoose_1.model('tickets', exports.TicketSchema);
