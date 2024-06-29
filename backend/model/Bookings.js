const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    name: {
        type: String
    },

    phone: {
        type: String
    },

    date: {
        type: String
    },

    time: {
        type: String
    },

    note: {
        type: String
    },

    samples: {
        default: null,
        type: Array
    },

    cancelReason: {
        type: String
    },

    status: {
        type: Number
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Bookings || mongoose.model("Bookings", BookingSchema);