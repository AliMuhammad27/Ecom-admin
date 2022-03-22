const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const generateToken = require("../../utils/generateJwtToken");

router.get("/getProfile", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error(err.message);
  }
});

//user login route
router.post(
  "/",
  [
    check("email", "email address is required").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //checking if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //matching password
      const ismatch = await bcrypt.compare(password, user.password);
      if (!ismatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password Incorrect" }] });
      }
      //generating token
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

//User edit profile
router.post(
  "/editprofile",
  [
    check("firstname", "firstname is required").exists(),
    check("lastname", "lastname is required").exists(),
    check("email", "email is required"),
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, email } = req.body;
    try {
      let userexists = await User.findOne({ email });
      if (!userexists) {
        return res.status(401).json({ msg: "No User Found" });
      }
      (userexists.firstname = firstname),
        (userexists.lastname = lastname),
        (userexists.email = email);
      await userexists.save();
      console.log("updateUser", userexists);
      return res.json({ userexists });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//reset password
router.post(
  "/resetpw",
  [
    check("password", "password is required").exists(),
    check("email", "email is required").exists(),
    check("newpassword", "newpassword is required").exists(),
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { password, confirmpassword, newpassword, email } = req.body;
    //console.log(confirmpassword);
    try {
      //checking if the user exists
      let userexists = await User.findOne({ email });
      if (!userexists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Does not exists" }] });
      }
      //for matching current password
      const ismatch = bcrypt.compare(password, confirmpassword);
      if (!ismatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password does not match" }] });
      }
      const salt = await bcrypt.genSalt(10);
      newpassword = await bcrypt.hash(newpassword, salt);
      userexists.password = newpassword;
      await userexists.save();
      console.log("updateduser", userexists);
      return res.json({ msg: "Password Successfully reset" });
      //console.log(newpassword);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
