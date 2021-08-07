const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { User } = require("../models/userModal");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_KEY);

//add orders to the users orders
router.put("/addOrders", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.body.user.id);

  try {
    const user = await User.findById(req.body.user.id);
    req.body.orders.forEach((item) => {
      user.orders.push(item);
    });
    user.save();
    res.send(user.orders);
  } catch (error) {
    res.send(error.message);
  }
});

//register for new user route
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  //validate
  try {
    if (!email)
      return res.status(400).json({ msg: "email--- field is required" });
    if (!password) return res.status(400).json({ msg: "password is required" });
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exist" });

    //salting and hashing the password the user enters
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    //construct the new user object
    const newUser = User({
      email,
      password: hashedPassword,
      name,
      isAdmin: false,
    });

    //save the user to the Databasee
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//login the user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate the input fields
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });
    const user = await User.findOne({ email: email });

    if (!user)
      return res.status(400).json({ msg: "No account with email exists." });
    //compare the password entered to the password stored in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    //if no match, send error messsage
    if (!isMatch) res.status(400).json({ msg: "Password is incorrect." });
    //if passwords match, generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        address: user.address,
        orders: user.orders,
      },
      process.env.JWT_SECRET
    );
    res.send(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//address helper function
const addressHelper = (object) => {
  const {
    address_city,
    address_country,
    address_line1,
    address_state,
    address_zip,
  } = object;
  ///update the address
  const address = {
    street: address_line1,
    city: address_city,
    postalCode: address_zip,
    province: address_state,
    country: address_country,
  };

  return address;
};

//get user info
router.post("/user", async (req, res) => {
  const id = req.body.id;
  await User.findById({ _id: id }).exec(function (err, product) {
    if (err) {
      res.send(err);
    } else {
      res.json(product);
    }
  });
});
//checkout route
router.post("/checkout", async (req, res) => {
  let error;
  let status;
  try {
    const { product, token } = req.body;

    const amount = product.reduce(
      (total, current) => (total += current.price * current.quantity),
      0
    );
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotencyKey = uuidv4();

    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "cad",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotencyKey,
      }
    );

    status = "success";

    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { address: addressHelper(token.card) } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        } else {
        }
      }
    );
    user.save();
    res.send({ user, status });
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
    res.send({ error, status });
  }

  //res.json({ error, status });
});

router.delete("/delete", auth, async (req, res) => {
  try {
    //delete user from data base
    const deletedUser = await User.findByIdAndDelete(req.user);

    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
