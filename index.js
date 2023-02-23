const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(bodyParse.json());
app.use(cookieParser());
app.use(bodyParse.urlencoded({ extended: true }));

// cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static("assets"));

// or
// require("../models/Song");
// const url =
//   "mongodb+srv://Dadawit:<Dadawit0659>@musicplay.qjfbxhz.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(process.env.MONGODB_API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("db connected"))
  .catch((err) => console.log(err));
// connnect to local
// mongoose.connect("mongodb://localhost/ninjago");
// mongoose.Promise = global.Promise;

// module.exports.handler = serverless(app);
// set routes
app.use("/api", require("./routes/api"));

app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});

app.listen(process.env.port || 4000, function () {
  console.log("now listning for request");
});
