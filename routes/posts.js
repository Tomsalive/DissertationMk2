const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    console.log("GET USERS PAGE")
    res.send("GET USERS PAGE")
})
  
router.get("/new", (req, res) => {
    console.log("GET NEW USER PAGE")
    res.send("GET NEW USER PAGE")
})

module.exports = router