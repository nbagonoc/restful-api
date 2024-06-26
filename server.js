require('dotenv').config()
const express = require("express");
const app = express();

// DB CONNECT
const mongoose = require("mongoose");
const connectToDatabase = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the DB");
    } catch (err) {
        console.log("Error connecting to the DB:", err);
    }
};
connectToDatabase();

// MIDDLEWARES
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// USE ROUTES
const items = require("./routes/api/items");
app.use("/api/items", items);

// SET PORT, and START SERVER
const port = process.env.PORT || 5100;
const server = () => {
    try {
        app.listen(port);
        console.log(`We are live at: ${port}`);
    } catch (err) {
        console.log(`Server startup failed: ${err}`);
    }
};
server();

module.exports = {
    app,
    server,
};
