const express = require("express")
const fs = require("fs")

const app = express()

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
  apikey = readApiKey()
  console.log("GET HOME PAGE")
  res.render("home", {apikey: apikey})
})


const userRouter = require("./routes/users")
const postRouter = require("./routes/posts")

app.use("/users", userRouter)
app.use("/posts", postRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port http://localhost:3000"))
