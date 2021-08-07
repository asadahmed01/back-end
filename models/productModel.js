const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: String,
  price: String,
  selectedFile: String,
  description: String,
});

module.exports = Product = mongoose.model("product", productSchema);
