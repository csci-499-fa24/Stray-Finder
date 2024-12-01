const MatchVotes = require('../models/MatchVotes');
const Notification = require("../models/notification");
const User = require("../models/user");

// Function to handle match vote notifications
const notifyMatchVoteThreshold = async (matchVote) => {
    if (matchVote.yes >= 10) {
        const reports = [matchVote.report1, matchVote.report2];
        
        for (const report of reports) {
            const user = await User.findById(report.reportedBy);

            // Check if a notification already exists
            const existingNotification = await Notification.findOne({
                userId: user._id,
                "meta.matchVoteId": matchVote._id,
                "meta.reportId": report._id,
                type: "match_vote",
            });

            if (existingNotification) {
                // Update the notification's vote count
                existingNotification.message = `Your post has been matched to another post by ${matchVote.yes} users.`;
                existingNotification.meta.yesVotes = matchVote.yes;
                await existingNotification.save();
            } else {
                // Create a new pinned notification
                await Notification.create({
                    userId: user._id,
                    type: "match_vote",
                    message: `Your post has been matched to another post by ${matchVote.yes} users.`,
                    meta: {
                        matchVoteId: matchVote._id,
                        yesVotes: matchVote.yes,
                        reportId: report._id,
                        matchPostInfo: {
                            report1: matchVote.report1,
                            report2: matchVote.report2,
                        },
                    },
                    pinned: true,
                });
            }
        }
    }
};

module.exports = {
    backfillMatchVoteNotifications,
    notifyMatchVoteThreshold,
};
