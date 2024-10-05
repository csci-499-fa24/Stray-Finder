const express = require('express')
const cors = require('cors')
const app = express()
const message = require('./routes/message')
const spottedstray = require('./routes/spottedstray')
const lostpet = require('./routes/lostpet');
const user = require('./routes/user')

/**
 * Connection to the database
 */
const connectDB = require('./db/connect')
require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)

/**
 * Section for APIs
 */
app.use('/api/message/', message)
app.use('/api/spottedstray/', spottedstray)
app.use('/api/user/', user);
app.use('/api/lostpet/', lostpet);

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