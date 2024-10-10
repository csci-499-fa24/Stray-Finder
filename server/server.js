const express = require('express')
const cors = require('cors')
const app = express()
<<<<<<< HEAD
const animal = require('./routes/animals')
const auth = require('./routes/auth')
=======
const message = require('./routes/message')
const spottedstray = require('./routes/spottedstray')
const lostpet = require('./routes/lostpet');
>>>>>>> navbar_function_with_spottedstray
const user = require('./routes/user')

/**
 * Connection to the database
 */
const connectDB = require('./db/connect')
require('dotenv').config()

/**
 * Section for middleware
 */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)
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
<<<<<<< HEAD
app.use('/api/animal/', animal)
///////////////////////////////////////////////////////////////////////////
=======
app.use('/api/message/', message)
app.use('/api/spottedstray/', spottedstray)
app.use('/api/user/', user);
app.use('/api/lostpet/', lostpet);
>>>>>>> navbar_function_with_spottedstray

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