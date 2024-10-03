const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, 
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long.'],
        validate:{ // checks if the password contains a space
            validator: (v) => {
                return !/\s/.test(v);
            },
            message: "Password cannot contain spaces."
        }
    },
    //isVerified: { type: Boolean, default: false }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) { // if the password is modified, then hash the password
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);