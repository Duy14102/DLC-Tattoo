const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    data: {
        type: Array,
        default: null
    },

    createdBy: {
        type: String,
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Chats || mongoose.model("Chats", ChatSchema);