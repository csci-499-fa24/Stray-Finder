const express = require('express');
const router = express.Router();
const { sendSummaryEmails } = require('../utils/notificationSummary');

// Test route for daily summaries
router.post('/daily-summary', async (req, res) => {
    try {
        await sendSummaryEmails('daily');
        res.status(200).send('Daily summary emails sent successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send daily summary emails.');
    }
});

// Test route for weekly summaries
router.post('/weekly-summary', async (req, res) => {
    try {
        await sendSummaryEmails('weekly');
        res.status(200).send('Weekly summary emails sent successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send weekly summary emails.');
    }
});

// Test route for monthly summaries
router.post('/monthly-summary', async (req, res) => {
    try {
        await sendSummaryEmails('monthly');
        res.status(200).send('Monthly summary emails sent successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send monthly summary emails.');
    }
});

module.exports = router;
