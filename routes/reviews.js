const express = require("express")
const router = express.Router()
const review = require("../models/reviews")

router.get("/", async (req, res) => {
    try {
        const reviews = await review.find()
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ message: err.message})
    } 
    //console.log("GET USERS PAGE")
    //res.send("GET USERS PAGE")
})
  
router.post("/", async (req, res) => {
    const review = new review({
        title: req.body.title,
        location: req.body.location,
        review: req.body.review,
        stars: req.body.stars,
    })

    try {
        const newReview = await review.save()
        res.status(201).json(newReview)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

router.get("/new", (req, res) => {
    console.log("GET NEW REVIEW PAGE")
    res.send("GET NEW REVIEW PAGE")
})

module.exports = router