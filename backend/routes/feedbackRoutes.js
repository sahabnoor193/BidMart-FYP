const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedbackModel");

// Submit new feedback
router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get approved feedback for Testimonials
router.get("/approved", async (req, res) => {
  try {
    const approved = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(approved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;