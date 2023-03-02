const express = require("express");

const http = require("http");

const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors({ origin: true }));


require("dotenv").config();
const PORT = 8080;


app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const server = http.createServer(app);

app.use("/api/user", require("./routes/users")());
app.use("/api/item", require("./routes/items")());

server.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});