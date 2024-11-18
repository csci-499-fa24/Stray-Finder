const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const animal = require('./routes/animal')
const animalReport = require('./routes/animalReport')
const story = require('./routes/story')
const user = require('./routes/user')
const auth = require('./routes/auth')
const message = require('./routes/message');
const report = require('./routes/report');
const match = require('./routes/match')
const email = require('./routes/email')
const profile = require('./routes/profile');
const { exec } = require('child_process')
const commentRoutes = require('./routes/comment');

/**
 * Connection to the database
 */
const connectDB = require('./db/connect')
require('dotenv').config()

/**
 * Section for middleware
 */
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
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

/**
 * Section for authentication routes
 */
app.use('/auth', auth)
///////////////////////////////////////////////////////////////////////////

/**
 * Section for APIs
 */
app.use('/api/animal/', animal)
app.use('/api/animal-report/', animalReport)
app.use('/api/story/', story)
app.use('/api/message/', message);
app.use('/api/report/', report);
app.use('/api/user/', user)
app.use('/api/match/', match)
app.use('/api/email/', email)
app.use('/api/profile/', profile);
app.use('/api/comments/', commentRoutes);
///////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 8080
// Load DB then start server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server started on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

// server.js

if (require.main === module) {
    start(); // Only start server if file is run directly
}

// Export app for testing
module.exports = app;