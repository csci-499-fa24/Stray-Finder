const Comment = require('../models/comment'); // Import the comment model
const AnimalReport = require('../models/animalReport'); // Reference for animal reports

// Save a new comment
const saveComment = async (req, res) => {
  const { reportId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const comment = new Comment({
      content,
      reportId,
      userId: req.user._id, // From auth middleware
    });

    await comment.save();
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
        .sort({ createdAt: 1 }); 
  
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
