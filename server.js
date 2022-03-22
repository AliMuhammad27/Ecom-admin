const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const app = express();
const Port = process.env.Port || 5000;
const connection = require("./config/db");
const { fileStorage, fileFilter } = require("./multer");

//adding init middleware

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: "reciepts",
      maxCount: 5,
    },
  ])
);

app.use(express.json());

//connecting to db
connection();
//multer config

//static file path config

//adding define routes
app.use("/api/user", require("./routes/api/user"));
//user auth
app.use("/api/adminauth", require("./routes/api/adminauth"));
app.use("/api/auth", require("./routes/api/auth"));
// admin auth
app.use("/api/admin", require("./routes/api/admin"));
//tax route
app.use("/api/tax", require("./routes/api/tax"));
//feedback route
app.use("/api/feedback", require("./routes/api/feedback"));
//category route
app.use("/api/category", require("./routes/api/category"));
//product route
app.use("/api/product", require("./routes/api/product"));
const __dirname1 = path.resolve();
console.log(__dirname1);
app.use("/uploads", express.static(path.join(__dirname1, "/uploads")));
app.use("/api/download/uploads/:file_name", function (req, res) {
  console.log("IN HERE", req.params);
  const file = `${__dirname}/uploads/${req.params.file_name}`;
  res.download(file); // Set disposition and send it.
});

app.get("/", (req, res) => {
  res.send("Express Server");
});
app.listen(Port, () => {
  console.log(`Server is running on ${Port}`);
});
