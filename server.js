// INIT App
const express = require("express");
const app = express();

// DB CONNECT
const mongoose = require("mongoose");
const { mongoURI } = require("./config/dbSecretKeys");
const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
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
const port = process.env.PORT || 3100;
const server = async () => {
    try {
        await app.listen(port);
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
