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
    try {
      const userID = req.session.passport.user.ID;
      const reviews = await Review.find({ userID: userID })
      //res.json(reviews)
      res.render("userReviews", { reviews: reviews })
    } catch (err) {
      res.status(500).json({ message: err.message})
    } 
})

router.get("/update/:ReviewID",checkAuthenticated, async (req, res) => {
  try {
    //const userID = req.session.passport.user.ID;
    //const reviews = await Review.find({ userID: userID })
    //res.json(reviews)
    const review = await Review.findById(req.params.ReviewID)
    res.render("updateReview", { review: review })
  } catch (err) {
    res.status(500).json({ message: err.message})
  } 
})

router.patch("/update/:ReviewID", checkAuthenticated, async (req, res) => {
  console.log("here");
  console.log("Requested review ID:", req.params.ReviewID);

  // Fetch the review from the database
  const review = await Review.findById(req.params.ReviewID);
  console.log("Found review:", review);

  // Update the review properties
  if (req.body.title != null) {
    review.title = req.body.title;
  }
  if (req.body.address != null) {
    review.address = req.body.address;
  }
  if (req.body.reviewBody != null) {
    review.reviewBody = req.body.reviewBody;
  }
  if (req.body.stars != null) {
    review.stars = req.body.stars;
  }
  if (req.body.coordinate != null) {
    review.coordinate = req.body.coordinate;
  }

  try {
    const updatedReview = await review.save();
    res.json(updatedReview);
    console.log("Review Updated. Updated Review:", updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/update/:ReviewID", checkAuthenticated, getReview, async (req, res) => {
  try {
      await Review.findByIdAndDelete(req.params.ReviewID)
      res.json({ message: "Deleted Review"})
  } catch (err) {
      //console.log("here")
      res.status(500).json({ message: err.message})
  }
})

router.get("/:ReviewID", checkAuthenticated, async (req, res) => {
    try {
      console.log("Requested review ID:", req.params.ReviewID);
      const review = await Review.findById(req.params.ReviewID);
      console.log("Found review:", review);
      console.log("attempting to retrive userID");
      const user = await User.findById(review.userID);
      console.log("userID:", user);

      console.log("attempting to retrive username");
      const username = user.username;
      console.log("username:", username);
      const email = user.email;
      console.log("email:", email);
      res.render("singleReview", { review: review, username, email});
    } catch (err) {
      console.error("Error fetching review:", err);
      res.status(500).json({ message: err.message });
    }
  });



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
    next()
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/home')
}

module.exports = router