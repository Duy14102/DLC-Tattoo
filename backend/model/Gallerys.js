const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    title: {
        type: String
    },

    data: {
        type: String,
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model.Gallerys || mongoose.model("Gallerys", GallerySchema);