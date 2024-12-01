const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/notification");
const { backfillMatchVoteNotifications } = require("../controllers/notification");

//Get Pinned notification
router.get('/pinned', auth, async (req, res) => {
  try {
      const pinnedNotifications = await Notification.find({
          userId: req.user.id,
          pinned: true,
      }).sort({ createdAt: -1 });

      res.status(200).json({ notifications: pinnedNotifications });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching pinned notifications' });
  }
});

// Get user notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

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
