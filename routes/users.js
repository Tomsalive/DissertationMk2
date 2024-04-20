const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require('bcrypt')

router.get("/", async(req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message})
    } 
})

router.post("/", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log(hashedPassword)
        const user = new User({
            username: req.body.username, 
            password: hashedPassword
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

router.delete("/:UserID", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.UserID)
        res.json({ message: "Deleted User"})
    } catch (err) {
        //console.log("here")
        res.status(500).json({ message: err.message})
    }
})

router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (user == null) {
        return res.status(400).json({ message: "Cannot find user"})
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


/*
router.get("/", (req, res) => {
    console.log("GET USERS PAGE")
    res.send("GET USERS PAGE")
})
  
router.get("/new", (req, res) => {
    console.log("GET NEW USER PAGE")
    res.render("users/new", {firstName: "Test"})
})

router.post("/", (req, res) => {
    const isValid = false
    if (isValid) {
        users.push({ firstName: req.body.firstName })
        res.redirect(`/users/${users.length - 1}`)
    } else {
        console.log("Error")
        res.render("users/new", {firstName: req.body.firstName})
    }
})

router
.route("/:UserID")
.get((req, res) => {
    console.log(req.user)
    res.send(`GET USER PAGE: ${req.params.UserID}`)
    console.log(req.user)
})
.patch((req, res) => {
    res.send(`UPDATE USER PAGE: ${req.params.UserID}`)
})
.delete((req, res) => {
    res.send(`DELETE USER PAGE: ${req.params.UserID}`)
})

const users = [{ name: "Tom" }, { name: "Bob" }]

router.param("UserID", (req, res, next, UserID) => {
    req.user = users[UserID]
    next()
})

*/



module.exports = router