const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const generateToken = require("../../utils/generateJwtToken");
//user and admin register route
router.post(
  "/",
  [
    check("firstname", "firstname is required").not().isEmpty(),
    check("lastname", "last name is required").not().isEmpty(),
    check("email", "email address is required").isEmail(),
    check("password", "Enter a password of lenght greater than 6").isLength({
      min: 7,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, email, password } = req.body;
    try {
      //checking if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }
      user = new User({
        firstname,
        lastname,
        email,
        password,
      });

      //encrypting password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //generating token
      //here can call that
      // const payload = {
      //   user: {
      //     _id: user._id,
      //   },
      // };
      // jwt.sign(
      //   payload,
      //   config.get("jwtKey"),
      //   { expiresIn: 36000 },
      //   (err, token) => {
      //     if (err) throw new err();
      //     res.send(token);
      //   }
      // );
      await user.save();
      let token = generateToken(user._id);
      return res.json({ token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
