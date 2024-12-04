const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notification");
const auth = require("../middleware/auth");
const Notification = require("../models/notification");

// Get user notifications
router.get("/", auth, getNotifications);

// Mark notifications as read
router.post("/mark-as-read", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true });
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

module.exports = router;
