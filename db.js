const mongoose = require('mongoose');
require("dotenv").config();

const connectToDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`)
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectToDb;
