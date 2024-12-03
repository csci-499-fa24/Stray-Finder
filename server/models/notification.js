const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    message: { type: String, required: true }, // The main notification text
    read: { type: Boolean, default: false }, // Whether the notification has been read
    isPinned: { type: Boolean, default: false },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // The creation timestamp
    meta: {
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "AnimalReport" }, // Reference to the report (for comment notifications)
      commentCount: { type: Number, default: 0 }, // Number of comments (for batched notifications)
      latestComment: { type: String }, // The latest comment text
      postPreview: {
        name: { type: String }, // Name of the post/animal
        description: { type: String },
        species: { type: String }, // Species of the animal
        imageUrl: { type: String }, // URL of the post/animal image
      },
      commenterName: { type: String },
      commenterProfileImage: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
