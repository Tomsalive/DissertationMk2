require('dotenv').config()
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const favicon = require('serve-favicon'); 

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

const initializePassport = require('./passport-config')

const User = require("./models/user")

initializePassport(
  passport, 
  email => User.find(email),
  _id => User.find(_id)
)


app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(flash())

app.use(favicon('./favicon.ico'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set("view engine", "ejs")
app.use(logger)

app.get("/", (req, res) => {
  console.log("GET INDEX PAGE")
res.render("index")
})

app.get("/home", checkAuthenticated, (req, res) => {
  console.log("GET HOME PAGE")
res.render("home", {username: req.user.username})
})

app.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  });
})


//const userRouter = require("./routes/users")
const reviewRouter = require("./routes/reviews")
const loginRouter = require("./routes/login")
const signupRouter = require("./routes/signup")

//app.use("/users", userRouter)
app.use("/reviews", reviewRouter)
app.use("/login", loginRouter)
app.use("/signup", signupRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

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

const port = process.env.PORT || 3000

app.listen(port)
console.log("Server is running on port http://localhost:%d", port)