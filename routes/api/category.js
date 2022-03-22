const express = require("express");
const { check, validationResult } = require("express-validator");
const Category = require("../../models/Category");
const router = express.Router();

//create category
router.post(
  "/addCat",
  [
    check("categoryTitle", "categoryTitle is required").exists(),
    check("description", "description is required").exists(),
    check("visible", "visible is required").exists(),
  ],
  async (req, res) => {
    const { categoryTitle, description, visible, status } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      const category = new Category({
        categoryTitle,
        description,
        visible,
        status,
      });
      console.log("Category Created", category);
      const categoryCreated = await category.save();
      if (categoryCreated) {
        res.status(200).json({ msg: "Category was successfully created" });
      } else {
        return res.status(401).json({ msg: "Invalide Category details" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//edit category
router.post(
  "/editCat/:catid",
  [
    check("categoryTitle", "categoryTitle is required").exists(),
    check("description", "description is required").exists(),
    check("visible", "visible is required").exists(),
  ],
  async (req, res) => {
    const { categoryTitle, description, visible } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      const catexists = await Category.findById(req.params.catid);
      if (!catexists) {
        return res.status(401).json({ msg: "No Category Found" });
      }
      catexists.categoryTitle = categoryTitle;
      catexists.description = description;
      catexists.visible = visible;
      await catexists.save();
      console.log("Edited Category", catexists);
      if (catexists) {
        res.json({ msg: "Category Successfully edited" });
      }
    } catch (err) {
      if (err.kind === "ObjectId")
        return res.status(404).json({ msg: "No Category Found" });
    }
  }
);

//get category details
router.get("/getAllCats", async (req, res) => {
  const { page, limit } = req.query;
  try {
    const cats = await Category.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Category.countDocuments();
    res.status(200).json({
      cats,
      totalPage: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

//get cat by id
router.get("/getCat/:catid", async (req, res) => {
  try {
    const category = await Category.findById(req.params.catid);
    if (category) {
      res.status(200).json({ category });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(500).json({ msg: "No Category Found" });
    }
  }
});

//toggle status
router.get("/toggleCat/:catid", async (req, res) => {
  try {
    const category = await Category.findById(req.params.catid);
    console.log("category", category);
    category.status = category.status == true ? false : true;
    await category.save();
    console.log("CatStatus", category);
    res.status(200).json({
      msg: category.status ? "Category Activated" : "Category Deactivated",
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(500).json({ msg: "No Category found to toggle" });
    }
  }
});

module.exports = router;
