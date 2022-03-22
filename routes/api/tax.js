const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Tax = require("../../models/Tax");

//create tax
router.post(
  "/createTax",
  [
    check("state", "state is required").exists(),
    check("percent", "percent is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    let { state, percent } = req.body;
    try {
      let taxexists = await Tax.findOne({ state });
      if (taxexists) {
        return res
          .status(401)
          .json({ msg: "Task is already present for this state" });
      }
      let tax = new Tax({
        state,
        percent,
      });
      console.log("tax", tax);
      let taxCreated = await tax.save();
      if (taxCreated) {
        res.status(201).json({ msg: "Tax Created" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//edit tax by id
router.post(
  "/editTax/:taxid",
  [
    check("state", "state is required").exists(),
    check("percent", "percent is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    let { state, percent } = req.body;
    try {
      let taxexists = await Tax.findById(req.params.taxid);
      if (!taxexists) {
        return res.status(401).json({ msg: "No Tax exists to edit" });
      }
      taxexists.state = state;
      taxexists.percent = percent;
      await taxexists.save();
      console.log("updated tax", taxexists);
      if (taxexists) {
        res.status(201).json({ msg: "Tax Edited" });
      }
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(500).json({ msg: "No taxs found" });
      }
    }
  }
);

//delete tax by id
router.delete("/deleteTax/:taxid", async (req, res) => {
  try {
    await Tax.findByIdAndDelete(req.params.taxid);
    return res.status(201).json({ msg: "Tax was deleted succefully" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(500).json({ msg: "No taxs found" });
    }
  }
});

//getting all tax (tax details)
router.get("/getAllTaxs", async (req, res) => {
  try {
    const { page, limit } = req.query;
    // execute query with page and limit values
    const tax = await Tax.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    const count = await Tax.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      tax,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
