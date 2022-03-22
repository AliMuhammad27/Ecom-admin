const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Admin = require("../../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateJwtToken");

//register admin
router.post(
  "/register",
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
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Admin already exists" }] });
      }
      admin = new Admin({
        firstname,
        lastname,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
      await admin.save();
      console.log(admin);
      let token = generateToken(admin._id);
      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
