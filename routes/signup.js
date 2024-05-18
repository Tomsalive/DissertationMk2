const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')

router.get("/", checkNotAuthenticated, (req,res) => {
    console.log("GET SIGN UP PAGE")
    res.render("signup", { locals: { email: '' } })
})

router.post("/", checkNotAuthenticated, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log(hashedPassword)
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email.toLowerCase(),
          });
        try {
            const newUser = await user.save()
            //res.status(201).json(newUser)
            res.redirect('./login')
        } catch (err) {
            //res.status(400).json({ message: err.message})
            res.redirect('/signup')
        }
    } catch (err) { 
        //res.status(500).json({ message: err.message})
        res.redirect('/signup')
    }
})
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('./home')
    }
    next()
}

  
module.exports = router