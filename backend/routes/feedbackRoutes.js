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

router.get("/",  async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a feedback
router.put("/:id/approve",  async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Decline a feedback
router.put("/:id/decline", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a feedback
router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});