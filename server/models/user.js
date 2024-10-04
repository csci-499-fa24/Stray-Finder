const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'Password must be at least 8 characters long.'],
            validate: {
                validator: (v) => {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(v)
                },
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
        },
    },
    { timestamps: true }
)

// Hash the password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10) // 10 rounds
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch (error) {
        return next(error)
    }
})

// Compare given password with hashed password in database
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
