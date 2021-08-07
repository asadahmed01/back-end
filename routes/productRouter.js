const router = require("express").Router();
const fs = require("fs");
const { Product } = require("../models/userModal");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addproducts", async (req, res) => {
  const form = req.body;

  const { title, price, description, selectedFile } = req.body;
  try {
    const newProduct = new Product({
      title: title,
      price: price,
      description: description,
      selectedFile: selectedFile,
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.send(error.message);
  }
});

//get one product
router.get("/getOneProduct", async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    res.send(product);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
