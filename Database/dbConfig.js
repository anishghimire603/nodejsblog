const mongoose = require("mongoose");

const connectToDatabase = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/my_intern_blog", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, () => {
            console.log("Database connected successfully")
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectToDatabase