const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')

router.get("/", (req,res) => {
    console.log("GET LOG IN PAGE")
    res.render("login")
})

router.post("/", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user == null) {
        return res.status(400).json({ message: "Cannot find user with that email"})
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.json({ message: "Success"})
        } else {
            res.json({ message: "Not Allowed"})
        }
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})
  
module.exports = router