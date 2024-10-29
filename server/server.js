const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const animal = require('./routes/animal')
const animalReport = require('./routes/animalReport')
const user = require('./routes/user')
const auth = require('./routes/auth')
const message = require('./routes/message')
const report = require('./routes/report')
const connectDB = require('./db/connect')

// Load environment variables based on NODE_ENV
const dotenv = require('dotenv')
const envFile =
    process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env'
dotenv.config({ path: envFile })

const app = express()

/**
 * Middleware setup
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

/**
 * Authentication and API routes
 */
app.use('/auth', auth)
app.use('/api/animal/', animal)
app.use('/api/animal-report/', animalReport)
app.use('/api/message/', message)
app.use('/api/report/', report)
app.use('/api/user/', user)

/**
 * Start the server if not in a test environment
 */
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 8080
    const startServer = async () => {
        try {
            await connectDB(process.env.MONGO_URI)
            app.listen(port, () =>
                console.log(`Server started on port ${port}`)
            )
        } catch (error) {
            console.error(error)
        }
    }
    startServer()
}

module.exports = app // Export the app for testing