const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Feedback = require("../../models/Feedback");

//creating a feedback
router.post(
  "/createFeedback",
  [
    check("firstname", "firstname is required").exists(),
    check("lastname", "lastname is required").exists(),
    check("email", "email is required").exists(),
    check("message", "message is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { firstname, lastname, email, message } = req.body;
    try {
      let feedbackexists = await Feedback.findOne({ email });
      if (feedbackexists) {
        return res.status(401).json({ msg: "feedback is already present" });
      }
      let feedback = new Feedback({
        firstname,
        lastname,
        email,
        message,
      });
      console.log("feedbackCreated", feedback);
      let feedbackcreated = await feedback.save();
      if (feedbackcreated) {
        res.status(201).json({ msg: "Feedback is created" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//delete a feedback by id
router.delete("/deleteFeedback/:feedbackId", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.feedbackId);
    return res.status(200).json({ msg: "Feedback was successfully deleted" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(401).json({ msg: "No feedback was found" });
    }
  }
});

//getting all the feedbacks
router.get("/getAllFeedbacks", async (req, res) => {
  const { page, limit } = req.query;
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Feedback.countDocuments();

    res.json({
      feedback,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
