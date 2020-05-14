const mongoose = require("mongoose");

const connectToDatabase = () => {
    try {
        mongoose.connect(process.env.DB_CONFIG, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }, () => {
            console.log("Database connected successfully")
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectToDatabase