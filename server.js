/////////////////////////////////////////
// TODO - convert to into pack. directory
/////////////////////////////////////////
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// INIT App
const app = express();

// DB CONFIG
const db = require("./config/dbSecretKeys").mongoURI;

// DB CONNECT
mongoose
  .connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {console.log("we are connected to the DB");})
  .catch(err => console.log(err));

//   MIDDLEWARES
// cors
app.use(cors());
// body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// REQUIRE ROUTES
const items = require("./routes/api/items");

// USE ROUTES
app.use("/api/items", items);

// SET PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`we are live at ${port}`);
});
