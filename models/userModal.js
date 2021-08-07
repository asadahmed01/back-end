const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  isAdmin: Boolean,
  orders: [
    {
      id: Number,
      title: String,
      price: Number,
      url: String,
      description: String,
      added: Boolean,
      quantity: Number,
    },
  ],
  address: {
    street: String,
    city: String,
    postalcode: String,
    province: String,
    country: String,
  },
});

const productSchema = mongoose.Schema({
  _id: String,
  title: String,
  price: Number,
  selectedFile: String,
  description: String,
});

//Then define discriminator field for schemas:
const baseOptions = {
  discriminatorKey: "__type",
  collection: "products",
};
const Base = mongoose.model("Base", new mongoose.Schema({}, baseOptions));

const Product = Base.discriminator("product", productSchema);
const User = Base.discriminator("user", userSchema);
module.exports = { Product, User };
//module.exports = User = mongoose.model("user", userSchema);
