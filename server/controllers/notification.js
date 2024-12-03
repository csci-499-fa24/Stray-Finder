const Notification = require("../models/notification");

const createNotification = async ({ userId, message, type, meta, isPinned = false }) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
      meta,
      isPinned,
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ isPinned: -1, createdAt: -1 }) // Pinned first, then by date
      .exec();
    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

module.exports = { createNotification, getNotifications };
