const express = require("express");
const cors = require('cors')
const app = express();
const message = require('./routes/message')

/**
 * Connection to the database
 */
const connectDB = require('./db/connect')
require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

/**
 * Section for APIs
 * Currently just message
 */
app.use('/api/message/', message)

const port = process.env.PORT || 8080;
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