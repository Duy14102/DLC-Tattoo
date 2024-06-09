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
        id: {
            type: String
        }
    },

    userimage: {
        default: null,
        type: String
    },

    notification: {
        title: {
            type: String
        },
        message: {
            type: String
        },
        status: {
            type: Number
        },
        time: {
            type: Date
        }
    },

    role: {
        type: Number
    },

    status: {
        default: 1,
        type: Number
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Users || mongoose.model("Accounts", UserSchema);