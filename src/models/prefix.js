"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prefix = exports.PrefixSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PrefixSchema = new mongoose_1.Schema({
    Prefix: {
        type: String
    },
    GuildID: String
});
exports.Prefix = mongoose_1.model('prefixes', exports.PrefixSchema);
