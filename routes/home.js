const express = require("express")
const router = express.Router()
const Review = require("../models/review")
const User = require("../models/user")

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const reviews = await Review.find()
        //res.json(reviews)
        res.render("home", { reviews: reviews })
    } catch (err) {
        res.status(500).json({ message: err.message})
    } 
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
  
module.exports = router