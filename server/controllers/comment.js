const Comment = require('../models/comment'); // Import the comment model
const AnimalReport = require('../models/animalReport'); // Reference for animal reports
const Notification = require("../models/notification");

// Save a new comment
const saveComment = async (req, res) => {
  const { reportId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    // Create a new comment
    const comment = new Comment({
      content,
      reportId,
      userId: req.user._id, // From auth middleware
    });

    await comment.save();

    // Populate the commenter data (username and profile image)
    await comment.populate('userId', 'username profileImage');
    const commenter = comment.userId; // Now contains username and profileImage

    if (!commenter) {
      return res.status(404).json({ message: 'Commenter not found' });
    }

    // Fetch the report for contextual previews
    const report = await AnimalReport.findById(reportId).populate('animal', 'name species imageUrl description');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const { reportedBy, animal } = report;

    // Ensure the commenter is not the report owner
    if (reportedBy.toString() !== req.user._id.toString()) {
      // Check for an existing notification for the same post
      const existingNotification = await Notification.findOne({
        userId: reportedBy,
        "meta.reportId": reportId,
        type: "comment",
      });

      if (existingNotification) {
        // Update the existing notification
        existingNotification.message = `New comments on your post: "${animal.name}"`;
        existingNotification.meta.commentCount += 1;
        existingNotification.meta.latestComment = content;
        existingNotification.meta.postPreview = {
          name: animal.name,
          description: animal.description,
          species: animal.species,
          imageUrl: animal.imageUrl,
        };
        existingNotification.updatedAt = Date.now();
        await existingNotification.save();

      } else {
        // Create a new notification
        const newNotification = await Notification.create({
          userId: reportedBy,
          type: "comment",
          message: `New comment on your post: "${animal.name}"`,
          meta: {
            reportId,
            commentCount: 1,
            latestComment: content,
            postPreview: {
              name: animal.name,
              description: animal.description,
              species: animal.species,
              imageUrl: animal.imageUrl,
            },
            commenterName: commenter.username, // Add commenter name
            commenterProfileImage: commenter.profileImage, // Add profile image
          },
        });
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Failed to save comment', error: error.message });
  }
};

// Fetch all comments for a specific report
const getComments = async (req, res) => {
    const { reportId } = req.params;
  
    try {
      const comments = await Comment.find({ reportId })
        .populate('userId', 'username profileImage') 
        .sort({ createdAt: -1 }); 
  
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
  };
  
// Fetch the count of comments for a specific report
const getCommentCount = async (req, res) => {
    const { reportId } = req.params;
  
    try {
      const count = await Comment.countDocuments({ reportId }); // Count comments for the given report
      res.status(200).json({ count }); // Send the count in the response
    } catch (error) {
      console.error('Error fetching comment count:', error);
      res.status(500).json({ message: 'Failed to fetch comment count', error: error.message });
    }
  };

module.exports = { saveComment, getComments, getCommentCount };
