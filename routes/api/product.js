const express = require("express");
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const router = express.Router();
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });
// const filefilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({ storage: storage, fileFilter: filefilter });

//adding a product
router.post("/addProduct", async (req, res) => {
  const { category, name, status, price, instock, description } = req.body;
  let _reciepts = [];
  const reciepts = [];
  _reciepts = req.files.reciepts;
  console.log("_reciepts", _reciepts);

  if (!Array.isArray(_reciepts)) throw new Error("Reciepts Required");
  _reciepts.forEach((img) => reciepts.push(img.path));

  try {
    const product = new Product({
      category,
      name,
      status,
      price,
      instock,
      description,
      productImage: reciepts,
    });
    if (product) {
      const cat = await Category.findOne({ _id: category });
      cat.categoryCount = cat.categoryCount + 1;
      const updatedCat = await cat.save();
      console.log("UpdatedCat", updatedCat);

      const productCreate = await product.save();
      console.log("ProductCreated", productCreate);

      res.status(200).json({ msg: "Product Created" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

//get all products
router.get("/getAll", async (req, res) => {
  const { page, limit } = req.query;
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments();
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

//get product by id
router.get("/getProduct/:proid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.proid);
    if (product) {
      res.json({ product });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product Found" });
    }
  }
});

//toggleStatus
router.get("/toggle/:prodid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.prodid);
    console.log("Product", product);
    product.status = product.status == true ? false : true;
    await product.save();
    console.log("ProdStat", product);
    res
      .status(200)
      .json({ msg: product.status ? "Product Active" : "Product InActive" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product Found" });
    }
  }
});

//edit product
router.post("/edit/:prodid", async (req, res) => {
  const { category, name, status, price, instock, description } = req.body;
  try {
    const product = await Product.findById(req.params.prodid);
    console.log("Old Product", product);
    if (product) {
      product.category = category ? category : product.category;
      product.name = name ? name : product.name;
      product.status = status ? status : product.status;
      product.price = price ? price : product.price;
      product.instock = instock ? instock : product.instock;
      product.description = description ? description : product.description;
    }
    const editedProd = await product.save();
    console.log("EditiedProd", editedProd);
    res.status(200).json({ msg: "Product was successfully edited" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product Found" });
    }
  }
});

//delete a product
router.delete("/deleteprod/:prodid", async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.prodid);
    res.status(200).json({ msg: "Product was successfully deleted" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product Found" });
    }
  }
});

module.exports = router;
