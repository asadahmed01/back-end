const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up exprss

const app = express();
//app.use(express.json());
app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(express.static("public"));
//set up routes

//User route
app.use("/", require("./routes/userRouter"));
app.use("/", require("./routes/productRouter"));
app.get("/api/products", (req, res) => {
  res.send([
    {
      id: 1,
      title: "Greek Yogurt",
      price: 19.86,
      url: "https://images.unsplash.com/photo-1604497181015-76590d828b75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80",
      description:
        "he raw chicken is marinated in a mixture of dahi (yogurt) and tandoori masala, a spice blend. It is seasoned and colored with cayenne pepper, red chili powder, or Kashmiri red chili powder as well as turmeric or food coloring.[a] The skin is generally removed before the chicken is marinated and roasted.",
      added: false,
    },

    {
      id: 2,
      title: "Basmati Rice",
      price: 11.86,
      url: "https://images.unsplash.com/photo-1604497181015-76590d828b75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80",
      description:
        "he raw chicken is marinated in a mixture of dahi (yogurt) and tandoori masala, a spice blend. It is seasoned and colored with cayenne pepper, red chili powder, or Kashmiri red chili powder as well as turmeric or food coloring.[a] The skin is generally removed before the chicken is marinated and roasted.",
      added: false,
    },

    {
      id: 3,
      title: "Chicken Tandoori",
      price: 18.36,
      url: "https://images.unsplash.com/photo-1604497181015-76590d828b75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80",
      description:
        "he raw chicken is marinated in a mixture of dahi (yogurt) and tandoori masala, a spice blend. It is seasoned and colored with cayenne pepper, red chili powder, or Kashmiri red chili powder as well as turmeric or food coloring.[a] The skin is generally removed before the chicken is marinated and roasted.",
      added: false,
    },

    {
      id: 4,
      title: "Pasta Alesso",
      price: 12.54,
      url: "https://images.unsplash.com/photo-1604497181015-76590d828b75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80",
      description:
        "he raw chicken is marinated in a mixture of dahi (yogurt) and tandoori masala, a spice blend. It is seasoned and colored with cayenne pepper, red chili powder, or Kashmiri red chili powder as well as turmeric or food coloring.[a] The skin is generally removed before the chicken is marinated and roasted.",
      added: false,
    },
  ]);
});

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
