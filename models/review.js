const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    stars: {
        type: String,
        required: true
    },
    reviewDate: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = mongoose.model('Review', reviewSchema)