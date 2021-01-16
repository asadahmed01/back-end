const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up exprss

const app = express();
app.use(express.json());
app.use(cors());

//set up routes

app.use("/", require("./routes/userRouter"));

const PORT = process.env.port || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("connected to mongoDB");
  }
);
