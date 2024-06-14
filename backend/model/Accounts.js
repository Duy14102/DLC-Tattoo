const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phonenumber: {
        type: String,
        required: [true, "Please provide a phone number!"],
        unique: [true, "Phone Number Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },

    favourite: {
        type: Array,
        default: null
    },

    userimage: {
        default: null,
        type: String
    },

    notification: {
        type: Array,
        default: null
    },

    role: {
        type: Number
    },

    status: {
        state: {
            default: 1,
            type: Number
        },
        reason: {
            type: String,
            default: null
        }
    },

    lastLogin: {
        type: Date
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Users || mongoose.model("Accounts", UserSchema);