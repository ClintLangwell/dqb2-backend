"use strict";

const express = require("express");
// const routes = require("./routes");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
// app.use("/", routes);

let port = 3000;

app.listen(port, (_) =>
  console.log(`Server running on
port: ${port}`)
);
