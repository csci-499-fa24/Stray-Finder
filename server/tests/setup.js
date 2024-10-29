const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

afterEach(async () => {
    const collections = mongoose.connection.collections
    for (let key in collections) {
        await collections[key].deleteMany()
    }
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})
