// INIT App
const express = require("express");
const app = express();

// DB CONNECT
const mongoose = require("mongoose");
const db = require("./config/dbSecretKeys").mongoURI;
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("we are connected to the DB"))
        .catch(err => console.log(err));

// MIDDLEWARES
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// USE ROUTES
const items = require("./routes/api/items");
app.use("/api/items", items);

// SET PORT
const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`we are live at ${port}`));