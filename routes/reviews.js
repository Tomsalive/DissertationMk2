const express = require("express")
const router = express.Router()
const Review = require("../models/review")
const User = require("../models/user")

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const reviews = await Review.find()
        //res.json(reviews)
        res.render("review", { reviews: reviews })
    } catch (err) {
        res.status(500).json({ message: err.message})
    } 
    //console.log("GET USERS PAGE")
    //res.send("GET USERS PAGE")
})

// reviews.js
router.get('/new', checkAuthenticated, async (req, res) => {
    try {
      res.render('newReview');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.post('/new', checkAuthenticated, async (req, res) => {
    if (req.session.passport && req.session.passport.user && req.session.passport.user.ID) {
        const userID = req.session.passport.user.ID;
        const review = new Review({
          userID: userID,
          title: req.body.title,
          address: req.body.address,
          coordinate: req.body.coordinate,
          reviewBody: req.body.reviewBody,
          stars: req.body.stars,
        });
      
        try {
          const newReview = await review.save();
          res.status(201).json(newReview);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      } else {
        // User information is not available yet
        console.log('User ID is undefined');
        return res.status(400).send('User ID is undefined');
      }
      });

router.get("/myreviews",checkAuthenticated, async (req, res) => {
  res.render("userReviews")
})

router.get("/:id", checkAuthenticated, async (req, res) => {
    try {
      console.log("Requested review ID:", req.params.id);
      const review = await Review.findById(req.params.id);
      console.log("Found review:", review);
      res.render("singleReview", { review: review });
    } catch (err) {
      console.error("Error fetching review:", err);
      res.status(500).json({ message: err.message });
    }
  });

router.patch("/:ReviewID", getReview, async (req, res) => {
    if (req.body.title != null) {
        res.review.title = req.body.title
      }
    if (req.body.address != null) {
        res.review.address = req.body.address
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/home')
}

module.exports = router