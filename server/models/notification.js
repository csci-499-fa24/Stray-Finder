const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    type: { type: String, required: true },
    message: { type: String, required: true }, // The main notification text
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
    meta: {
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "AnimalReport" }, // Reference to the report (for comment notifications)
      commentCount: { type: Number, default: 0 }, // Number of comments (for batched notifications)
      latestComment: { type: String }, // The latest comment text
      postPreview: {
        name: { type: String }, // Name of the post/animal
        description: { type: String },
        species: { type: String },
        imageUrl: { type: String },
      },
      commenterName: { type: String },
      commenterProfileImage: { type: String },

      // Match Vote-Specific Metadata
      matchVoteId: { type: mongoose.Schema.Types.ObjectId, ref: "MatchVotes" }, // Reference to the MatchVotes document
      yesVotes: { type: Number, default: 0 }, // Number of "yes" votes
      matchPostInfo: {
        report1: { type: mongoose.Schema.Types.ObjectId, ref: "AnimalReport" }, // First report in the match
        report2: { type: mongoose.Schema.Types.ObjectId, ref: "AnimalReport" }, // Second report in the match
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
