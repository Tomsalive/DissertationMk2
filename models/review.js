const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinate: {
        type: String,
        required: true
    },
    reviewBody: {
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