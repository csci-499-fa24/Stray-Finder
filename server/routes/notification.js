const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notification");
const auth = require("../middleware/auth");
const Notification = require("../models/notification");
const MatchVotes = require("../models/MatchVotes");
const Report = require("../models/animalReport");
const { createNotification } = require("../controllers/notification");

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

router.post("/recreate-pinned", async (req, res) => {
  try {
    const matches = await MatchVotes.find({ yes: { $gte: 10 } }).populate(["report1", "report2"]);
    let createdCount = 0;

    for (const match of matches) {
      const report1Owner = await Report.findById(match.report1).populate("reportedBy");
      const report2Owner = await Report.findById(match.report2).populate("reportedBy");

      // Create notifications for both matched reports
      if (report1Owner && report2Owner) {
        await createNotification({
          userId: report1Owner.reportedBy._id,
          message: "Your post has been matched with another post by 10+ users.",
          type: "match",
          meta: { reportId: match.report1, matchedReportId: match.report2 },
          isPinned: true,
        });

        await createNotification({
          userId: report2Owner.reportedBy._id,
          message: "Your post has been matched with another post by 10+ users.",
          type: "match",
          meta: { reportId: match.report2, matchedReportId: match.report1 },
          isPinned: true,
        });

        createdCount += 2; // Count each notification
      }
    }

    res.status(200).json({
      message: `Pinned notifications recreated successfully.`,
      createdCount,
    });
  } catch (error) {
    console.error("Error recreating pinned notifications:", error);
    res.status(500).json({ message: "Failed to recreate pinned notifications.", error });
  }
});

module.exports = router;
