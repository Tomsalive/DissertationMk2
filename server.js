require('dotenv').config()
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set("view engine", "ejs")
app.use(logger)

function readApiKey() {
    try {
      const apiKey = fs.readFileSync("API-KEY.txt", "utf8").trim()
      return apiKey
    } catch (error) {
      console.error("Error reading API key:", error)
      return null
    }
  }

app.get("/home", (req, res) => {
  //apikey = readApiKey()
  console.log("GET HOME PAGE")
res.render("home"/*, {apikey: apikey}*/)
})


const userRouter = require("./routes/users")
const reviewRouter = require("./routes/reviews")

app.use("/users", userRouter)
app.use("/reviews", reviewRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port http://localhost:3000"))
