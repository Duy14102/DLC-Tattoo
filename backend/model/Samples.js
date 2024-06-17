const mongoose = require("mongoose");

const SampleSchema = new mongoose.Schema({
    title: {
        type: String
    },

    content: {
        type: String
    },

    categories: {
        type: Array
    },

    rate: {
        type: Array
    },

    price: {
        type: Number
    },

    thumbnail: {
        type: String
    },

    session: {
        type: Array
    },

    lastUpdate: {
        type: Date
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Blogs || mongoose.model("Samples", SampleSchema);