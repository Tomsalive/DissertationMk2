const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')

router.get("/", (req,res) => {
    console.log("GET SIGN UP PAGE")
    res.render("signup")
})

router.post("/", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log(hashedPassword)
        const user = new User({
            username: req.body.username, 
            password: hashedPassword,
            email: req.body.email
        })
        try {
            const newUser = await user.save()
            res.status(201).json(newUser)
        } catch (err) {
            res.status(400).json({ message: err.message})
        }
    } catch { 
        res.status(500).json({ message: err.message})
    }
})
  

  
module.exports = router