const mongoose = require("mongoose");

const SampleSchema = new mongoose.Schema({
    title: {
        type: String
    },

    content: {
        type: String
    },

    categories: {
        data: {
            type: Array
        },
        count: {
            type: Number
        }
    },

    rate: {
        data: {
            type: Array
        },
        count: {
            type: Number
        }
    },

    price: {
        type: Number
    },

    thumbnail: {
        type: String
    },

    session: {
        data: {
            type: Array
        },
        count: {
            type: Number
        }
    },

    lastUpdate: {
        type: Date
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Blogs || mongoose.model("Samples", SampleSchema);