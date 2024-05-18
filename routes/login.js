const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')
const passport = require("passport")

router.get("/", checkNotAuthenticated, (req,res) => {
    console.log("GET LOG IN PAGE")
    res.render("login", { locals: { email: '' } })
})

router.post("/", checkNotAuthenticated, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      // Login failed, pass the error message back to the login page
      return res.render("login", { email: req.body.email, error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect("/home");
    });
  })(req, res, next);
});

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