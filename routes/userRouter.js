const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

//register for new user route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  //validate
  try {
    if (!email) return res.status(400).json({ msg: "email field is required" });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ msg: "invalid credentials." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
