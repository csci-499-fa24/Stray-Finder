const express = require('express')
const cors = require('cors')
//const http = require('http');
const cookieParser = require('cookie-parser')
const app = express()
const animal = require('./routes/animal')
const auth = require('./routes/auth')
const user = require('./routes/user')
const message = require('./routes/message');
const report = require('./routes/report'); // Added
//const setupSocket = require('./socket/socket');
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
app.use('/user', user)
///////////////////////////////////////////////////////////////////////////

/**
 * Section for APIs
 */
app.use('/api/animal/', animal)
app.use('/api/message/', message);
app.use('/api/report/', report); //Added
///////////////////////////////////////////////////////////////////////////

// // Create HTTP server with app
// const server = http.createServer(app);
// // Initialize Socket.IO with the HTTP server
// setupSocket(server);

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

start()
