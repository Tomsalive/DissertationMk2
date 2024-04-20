require('dotenv').config()
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set("view engine", "ejs")
app.use(logger)

app.get("/", (req, res) => {
  console.log("GET INDEX PAGE")
res.render("index")
})

app.get("/home", (req, res) => {
  console.log("GET HOME PAGE")
res.render("home")
})

const userRouter = require("./routes/users")
const reviewRouter = require("./routes/reviews")
const loginRouter = require("./routes/login")
const signupRouter = require("./routes/signup")

app.use("/users", userRouter)
app.use("/reviews", reviewRouter)
app.use("/login", loginRouter)
app.use("/signup", signupRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port http://localhost:3000"))
