const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const User = require("./models/user")

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
      const user = await User.findOne({ email: email })
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
  
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (err) {
        return done(err)
      }
    }
  
  
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => {done(null, user._id)})
    passport.deserializeUser((_id, done) => {
      return done(null, getUserById(_id))
    })
}

module.exports = initialize