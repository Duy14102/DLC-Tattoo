const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String
    },

    subtitle: {
        type: String
    },

    content: {
        type: String
    },

    thumbnail: {
        type: String
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Blogs || mongoose.model("Blogs", BlogSchema);