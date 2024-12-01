const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    type: { type: String, required: true },
    message: { type: String, required: true }, // The main notification text
    read: { type: Boolean, default: false }, // Whether the notification has been read
    timestamp: { type: Date, default: Date.now }, // The creation timestamp
    pinned: { type: Boolean, default: false }, // Whether the notification is pinned
    meta: {
      // Comment-Specific Metadata
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "AnimalReport" }, // Reference to the report (for comment notifications)
      commentCount: { type: Number, default: 0 }, // Number of comments (for batched notifications)
      latestComment: { type: String }, // The latest comment text
      postPreview: {
        name: { type: String }, // Name of the post/animal
        description: { type: String },
        species: { type: String }, // Species of the animal
        imageUrl: { type: String }, // URL of the post/animal image
      },
      commenterName: { type: String }, // Name of the commenter
      commenterProfileImage: { type: String }, // Profile image of the commenter

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
