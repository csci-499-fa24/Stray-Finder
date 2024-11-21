var nodemailer = require('nodemailer');
require('dotenv').config();
const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const User = require('../models/user');

const fetchAllRecentAnimals = async (req, res) => {
    try {
        const { reportType, gender, species, userId } = req.query;
        let query = {};

        // Filter by report type if provided
        if (reportType) query.reportType = reportType;

        // Search for the user by userId
        if (userId) {
            query.reportedBy = userId;
        }

        // Animal query for filtering by gender and species
        let animalQuery = {};
        if (gender) animalQuery.gender = gender;
        if (species) animalQuery.species = species;

        // If there are filters for animals, fetch their IDs
        if (Object.keys(animalQuery).length > 0) {
            const animals = await Animal.find(animalQuery).select('_id');
            const animalIds = animals.map((animal) => animal._id);
            query.animal = { $in: animalIds };
        }

        // Calculate the date one week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Filter for reports created within the last week
        query.dateReported = { $gte: oneWeekAgo };

        // Fetch and populate the reports, limiting to 5
        const reports = await AnimalReport.find(query)
            .populate('animal')
            .populate('reportedBy')
            .limit(5)
            .exec();

        return reports; // Return the reports to be used in sendEmail
    } catch (error) {
        console.error('Error fetching recent animals:', error); 
        throw new Error('Failed to fetch animal reports');
    }
};

const sendEmail = async ({ targetEmail, subject, body }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: targetEmail,
            subject,
            html: body,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};

const sendReportsEmail = async (req) => {
    try {
        // Fetch all users who have a notification preference for daily, weekly, or monthly
        const users = await User.find({
            notificationPreference: { $in: ['immediate', 'daily', 'weekly', 'monthly'] },
        });

        if (users.length === 0) {
            return 'No users to send reports to.';
        }

        // Categorize users based on their preferences
        // Categorize users based on their preferences
        const dailyUsers = users.filter((user) => 
            user.notificationPreference === 'daily' || user.notificationPreference === 'immediate'
        );
        const weeklyUsers = users.filter((user) => user.notificationPreference === 'weekly');
        const monthlyUsers = users.filter((user) => user.notificationPreference === 'monthly');

        // Fetch recent reports
        const reports = await fetchAllRecentAnimals(req);
        if (!reports || reports.length === 0) {
            return 'No reports to send.';
        }

        // Generate the email content
        let htmlContent = `
            <table width="100%" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                <tr>
                    <td colspan="5" style="background-color: #fdf2e9; color: white; padding: 10px; text-align: left; height: 95px;">
                        <img src="https://raw.githubusercontent.com/csci-499-fa24/Stray-Finder/refs/heads/main/client/app/components/layouts/assets/file.png" alt="Paw Icon" style="width: 50px; vertical-align: middle; margin-right: 10px;">
                        <span style="font-size: 1.5rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: black;">Stray Finder</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="padding: 20px; text-align: center;">
                        <h1 style="font-size: 1.5rem; color: #333;">Latest Animal Reports</h1>
                        <p style="font-size: 1rem; color: #555;">Here are the most recent animal reports from the last week:</p>
                    </td>
                </tr>
                <tr>
        `;

        reports.forEach((report, index) => {
            htmlContent += `
                <td class="report-item" style="width: 20%; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; text-align: center; vertical-align: top; box-sizing: border-box;">
                    <strong style="font-size: 1.1rem; color: #333;">${report.animal.name}</strong><br>
                    <span style="font-size: 0.9rem; color: #777;">(Species: ${report.animal.species}, Gender: ${report.animal.gender})</span><br>
                    <img src="${report.animal.imageUrl}" alt="${report.animal.name}" style="width: 100px; height: auto; border-radius: 8px; margin-top: 10px;"><br>
                    <p style="font-size: 0.9rem; color: #555;">Description: ${report.animal.description}</p>
                    <p style="font-size: 0.9rem; color: #555;">Reported by: ${report.reportedBy.username}</p>
                    <p style="font-size: 0.9rem; color: #555;">Report Type: ${report.reportType}</p>
                </td>
            `;

            if ((index + 1) % 5 === 0) {
                htmlContent += `</tr><tr>`;
            }
        });

        htmlContent += `</tr></table>`;

        // Current date
        const today = new Date();

        if (dailyUsers.length > 0) {
            for (const user of dailyUsers) {
                try {
                    await sendEmail({
                        targetEmail: user.email,
                        subject: 'Daily Animal Reports Summary',
                        body: htmlContent,
                    });
                } catch (emailError) {
                    console.error('Error sending email to daily user:', user.email, emailError);
                }
            }
        }        

        if (today.getDay() === 0 && weeklyUsers.length > 0) {
            for (const user of weeklyUsers) {
                try {
                    await sendEmail({
                        targetEmail: user.email,
                        subject: 'Weekly Animal Reports Summary',
                        body: htmlContent,
                    });
                } catch (emailError) {
                    console.error('Error sending email to weekly user:', user.email, emailError);
                }
            }
        }        

        // Send emails to monthly users on the 1st of the month
        if (today.getDate() === 1 && monthlyUsers.length > 0) {
            for (const user of monthlyUsers) {
                try {
                    await sendEmail({
                        targetEmail: user.email,
                        subject: 'Monthly Animal Reports Summary',
                        body: htmlContent,
                    });
                } catch (emailError) {
                    console.error('Error sending email to monthly user:', user.email, emailError);
                }
            }
        }        

        return 'Animal reports sent successfully.';
    } catch (error) {
        console.error('Failed to send animal reports email:', error);
        throw new Error('Failed to send animal reports email');
    }
};

module.exports = { sendEmail, sendReportsEmail, fetchAllRecentAnimals };

