const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
            _id: this._id,
            email: this.email,
            role: this.role
        },
        config.get('jwtPrivateKey'), {
            expiresIn: '1h'
        });
}
const User = mongoose.model('User', userSchema);
module.exports = User;