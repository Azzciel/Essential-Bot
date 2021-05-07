require('dotenv').config();
import mongoose = require("mongoose");
const user = process.env.DB_USER
const pass = process.env.DB_PASS
const db = process.env.DB_NAME

mongoose.set('useFindAndModify', false);

mongoose.connect(`mongodb+srv://${user}:${pass}@discord.6bauz.mongodb.net/${db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
