const Message = require('../models/message');
const User = require('../models/user');
const { sendEmail } = require('../controllers/email');

const sendSummaryEmails = async (frequency) => {
    try {
        // Fetch users with the specified notification preference (daily, weekly, or monthly)
        const users = await User.find({ notificationPreference: frequency });

        for (const user of users) {
            // Fetch unread messages for the user
            const unreadMessages = await Message.find({ recipientId: user._id, read: false })
                .populate('senderId', 'username')
                .sort({ timestamp: -1 });

            // Skip if there are no unread messages
            if (unreadMessages.length === 0) continue;

            // Generate the email content with a summary design
            const emailBody = `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <!-- Header Section -->
                    <div style="background-color: #fdf2e9; padding: 20px; text-align: center;">
                        <img src="https://raw.githubusercontent.com/csci-499-fa24/Stray-Finder/refs/heads/main/client/app/components/layouts/assets/file.png" alt="Stray Finder Logo" style="width: 80px; margin-bottom: 10px;">
                        <h1 style="font-size: 24px; color: #555; margin: 0;">Unread Messages Summary</h1>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 20px;">
                        <p style="font-size: 18px; margin: 0 0 15px;">Hi ${user.username},</p>
                        <p style="margin: 0 0 15px;">
                            You have <strong>${unreadMessages.length}</strong> unread message${unreadMessages.length > 1 ? 's' : ''}.
                        </p>
                        <p style="margin: 0 0 15px;">
                            Here’s a preview of the most recent message you received:
                        </p>
                        <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; margin: 0 0 15px;">
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${unreadMessages[0].senderId.username}:</p>
                            <blockquote style="margin: 10px 0; font-size: 16px; font-style: italic; color: #555; border-left: 4px solid #ff6f61; padding-left: 10px;">
                                ${unreadMessages[0].content}
                            </blockquote>
                            <p style="font-size: 14px; color: #777;">Received on: ${new Date(unreadMessages[0].timestamp).toLocaleString()}</p>
                        </div>
                        <p style="margin: 0 0 15px;">
                            You have more unread messages from:
                        </p>
                        <ul style="padding: 0; list-style: none; margin: 0 0 15px;">
                            ${Array.from(new Set(unreadMessages.map((msg) => msg.senderId.username)))
                              .map(
                                (username) => `
                                <li style="margin: 5px 0; font-size: 16px; color: #333;">
                                    <span style="font-weight: bold;">${username}</span>
                                </li>`
                              )
                              .join('')}
                        </ul>
                        <p style="margin: 0 0 15px;">
                            Log in to your account to view all your messages and respond:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://stray-finder-client.onrender.com/userMessages" 
                               style="background-color: #ff6f61; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; display: inline-block;">
                                View Messages
                            </a>
                        </div>
                    </div>

                    <!-- Footer Section -->
                    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                        <p style="margin: 0; font-size: 14px; color: #777;">
                            If you have any questions, feel free to reach out to us at 
                            <a href="mailto:support@strayfinder.com" style="color: #ff6f61;">support@strayfinder.com</a>.
                        </p>
                        <p style="margin: 10px 0 0; font-size: 14px; color: #aaa;">
                            © 2024 Stray Finder. All rights reserved.
                        </p>
                    </div>
                </div>
            `;

            // Send the email summary
            await sendEmail({
                targetEmail: user.email,
                subject: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Unread Messages Summary`,
                body: emailBody,
            });
        }
    } catch (error) {
        console.error('Error sending message summaries:', error);
    }
};

module.exports = { sendSummaryEmails };
