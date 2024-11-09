var nodemailer = require('nodemailer');
require('dotenv').config();
const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')

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
        throw new Error('Failed to fetch animal reports');
    }
};

const sendEmail = async (req, res, next) => {
    try {
        const {targetEmail} = req.params;
        // Fetch the most recent 5 animal reports
        const reports = await fetchAllRecentAnimals(req, res);

        // Generate the HTML email body with the first 5 pets
        let htmlContent = `
        <table width="100%" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <!-- Navbar/Header Section -->
            <tr>
                <td colspan="5" style="background-color: #fdf2e9; color: white; padding: 10px; text-align: left; height: 95px;">
                    <img src="https://raw.githubusercontent.com/csci-499-fa24/Stray-Finder/refs/heads/main/client/app/components/layouts/assets/file.png" alt="Paw Icon" style="width: 50px; vertical-align: middle; margin-right: 10px;">
                    <span style="font-size: 1.5rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: black;">Stray Finder</span>
                </td>
            </tr>
            
            <!-- Title Section -->
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center;">
                    <h1 style="font-size: 1.5rem; color: #333;">Latest Animal Reports</h1>
                    <p style="font-size: 1rem; color: #555;">Here are the most recent animal reports from the last week:</p>
                </td>
            </tr>
            
            <!-- Reports Section -->
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
            // Add a new row every 5 items
            if ((index + 1) % 5 === 0) {
                htmlContent += `</tr><tr>`;
            }
        });

        // Close the last row and the table
        htmlContent += `
                </tr>
            </table>
        `;


        // Configure the email transporter
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
            subject: 'Latest Animal Reports',
            html: htmlContent,
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to send email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Email sent successfully' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to fetch animal reports or send email',
            error: error.message,
        });
    }
};


module.exports = { sendEmail, fetchAllRecentAnimals };
