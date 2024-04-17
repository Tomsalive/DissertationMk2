const express = require("express")
const router = express.Router()

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
.put((req, res) => {
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

module.exports = router