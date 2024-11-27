const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const { exec } = require('child_process')
const cron = require('node-cron')

///////////////////////////////////////////////////////////////////////////
/**
 * Connection to the database
 */
const connectDB = require('./db/connect')
require('dotenv').config()
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/**
 * Section for middleware
 */
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/**
 * Section for APIs
 */
const animal = require('./routes/animal')
const animalReport = require('./routes/animalReport')
const story = require('./routes/story')
const user = require('./routes/user')
const auth = require('./routes/auth')
const message = require('./routes/message')
const report = require('./routes/report')
const match = require('./routes/match')
const email = require('./routes/email')
const profile = require('./routes/profile')
const matchVotes = require('./routes/MatchVotes')
const commentRoutes = require('./routes/comment')
const notificationRoutes = require("./routes/notification");
const { sendSummaryEmails } = require('./utils/notificationSummary')

/**
 * Section for authentication routes
 */
app.use('/auth', auth)

app.use('/api/animal/', animal)
app.use('/api/animal-report/', animalReport)
app.use('/api/story/', story)
app.use('/api/message/', message)
app.use('/api/report/', report)
app.use('/api/user/', user)
app.use('/api/match/', match)
app.use('/api/email/', email)
app.use('/api/profile/', profile)
app.use('/api/match-votes/', matchVotes)
app.use('/api/comments/', commentRoutes)
app.use("/api/notifications", notificationRoutes);
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/**
 * Section for story match function
 */
const createStoryFromHighMatch = require('./utils/matchChecker')
app.use('/special/route/for/demo/', createStoryFromHighMatch)

///////////////////////////////////////////////////////////////////////////
/**
 * Section for cron jobs
 */
cron.schedule('0 0 * * *', async () => {
    // Daily at midnight
    console.log('Sending daily message summaries...')
    await sendSummaryEmails('daily')
})

cron.schedule('0 0 * * SUN', async () => {
    // Weekly on Sundays
    console.log('Sending weekly message summaries...')
    await sendSummaryEmails('weekly')
})

cron.schedule('0 0 1 * *', async () => {
    // Monthly on the 1st
    console.log('Sending monthly message summaries...')
    await sendSummaryEmails('monthly')
})
///////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 8080
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

// Load DB then start server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, host, () => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
