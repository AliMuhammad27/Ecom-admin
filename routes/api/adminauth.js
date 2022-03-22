const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Admin = require("../../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateJwtToken");

const { check, validationResult } = require("express-validator");
const generateCode = require("../../service/generate_code");
const Reset = require("../../models/Reset");
const generatemail = require("../../service/generate_mail");

//getting admin profile
router.get("/getprofile", auth, async (req, res) => {
  try {
    let admin = await Admin.findById(req.admin._id).select("-password");
    return res.json({ admin });
  } catch (err) {
    console.error(err.message);
  }
});

//admin login
//user login route
router.post(
  "/login",
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
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //matching password
      const ismatch = await bcrypt.compare(password, admin.password);
      if (!ismatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password Incorrect" }] });
      }
      await admin.save();
      let token = generateToken(admin._id);
      return res.json({ token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//reset password
router.post(
  "/resetpw",
  [
    check("password", "password is required").exists(),
    check("email", "email is required").exists(),
    check("newpassword", "newpassword of lenght greater than 6 is required")
      .isLength({ min: 7 })
      .exists(),
    check("code", "code is required").exists(),
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { password, confirmpassword, newpassword, email, code } = req.body;
    //console.log(confirmpassword);
    try {
      //checking if the user exists
      const reset = await Reset.findOne({ email, code });
      console.log(reset);
      if (!reset) {
        return res.status(404).json({ msg: "Invalid code" });
      } else {
        let adminexists = await Admin.findOne({ email });
        if (!adminexists) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Admin Does not exists" }] });
        }
        //for matching current password
        const ismatch = password === confirmpassword;
        if (!ismatch) {
          return res
            .status(401)
            .json({ errors: [{ msg: "Password does not match" }] });
        }
        const salt = await bcrypt.genSalt(10);
        newpassword = await bcrypt.hash(newpassword, salt);
        adminexists.password = newpassword;
        await adminexists.save();
        console.log("updatedadmin", adminexists);
        return res.json({ msg: "Password Successuflly reset" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//edit profile
router.post(
  "/editprofile",
  [
    check("firstname", "firstname is required").exists(),
    check("lastname", "lastname is required").exists(),
    check("email", "email address is req").isEmail(),
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { firstname, lastname, email } = req.body;
    try {
      let adminexists = await Admin.findOne({ email });
      if (!adminexists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin Does not exists" }] });
      }
      adminexists.firstname = firstname;
      adminexists.lastname = lastname;
      adminexists.email = email;
      await adminexists.save();
      console.log("editedAdmin", adminexists);
      return res.json({ adminexists });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//verifying the Recover code
router.post(
  "/verifycode",
  [
    check("email", "email is required").isEmail().exists(),
    check("code", "code is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email, code } = req.body;
    try {
      let reset = await Reset.findOne({ email, code });
      if (reset) {
        return res.status(401).json({ msg: "Recovery code present" });
      } else {
        return res.status(401).json({ msg: "Invalid code" });
      }
    } catch (err) {
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//password recovery
router.post(
  "/recoverpwd",
  [check("email", "email address is req").isEmail().exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email } = req.body;
    try {
      let adminexists = await Admin.findOne({ email });
      if (!adminexists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin Does not exists" }] });
      }
      let code = generateCode();
      let reset = new Reset({
        email,
        code,
      });
      await reset.save();
      const html = `<p> your recovery code ${code} with this code you code you can recover your pw</p>`;
      await generatemail(email, "Password-Recovery", html);
      res
        .status(201)
        .json({ msg: "The recovery mail was sent to your registered email" });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
