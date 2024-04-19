const express = require("express")
const router = express.Router()
const Review = require("../models/review")

router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find()
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ message: err.message})
    } 
    //console.log("GET USERS PAGE")
    //res.send("GET USERS PAGE")
})
  
router.post("/", async (req, res) => {
    const review = new Review({
        title: req.body.title,
        location: req.body.location,
        review: req.body.review,
        stars: req.body.stars,
    })
    try {
        console.log("POST REVIEW")
        const newReview = await review.save()
        res.status(201).json(newReview)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

router.get("/:ReviewID", getReview, async (req, res) => {   
    console.log("GET REVIEW PAGE")
    res.send(res.review.title)
})
router.patch("/:ReviewID", getReview, async (req, res) => {
    if (req.body.title != null) {
        res.review.title = req.body.title
      }
    if (req.body.location != null) {
        res.review.location = req.body.location
      }
    if (req.body.review != null) {
        res.review.review = req.body.review
      }
    if (req.body.stars != null) {
        res.review.stars = req.body.stars
      }
    try {
        const updatedReview = await res.review.save()
        res.json(updatedReview)
      } catch (err) {
        res.status(400).json({ message: err.message })
    }

})


router.delete("/:ReviewID", getReview, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.ReviewID)
        res.json({ message: "Deleted Review"})
    } catch (err) {
        //console.log("here")
        res.status(500).json({ message: err.message})
    }
})

async function getReview(req, res, next) {
    let review
    try {
        review = await Review.findById(req.params.ReviewID)
        if (review == null) {
            return res.status(404).json({ message: "Cannot find review"})
        }
    }catch (err) {
        return res.status(500).json({ message: err.message})
    }
    
    res.review = review
    console.log(res.review)
    next()
}

module.exports = router