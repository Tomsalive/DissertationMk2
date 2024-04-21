const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')
const passport = require("passport")

router.get("/", checkNotAuthenticated, (req,res) => {
    console.log("GET LOG IN PAGE")
    res.render("login")
})

router.post("/", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/signup",
    failureFlash: true
}))

const initializePassport = require('../passport-config')

initializePassport(
  passport, 
  email => User.find(email),
  id => User.find(id),
)


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/home')
    }
    next()
}

  
module.exports = router