const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

router.get("/", checkNotAuthenticated, (req, res) => {
    console.log("GET SIGN UP PAGE");
    res.render("signup", { locals: { email: '', emailError: '' } });
});

router.post("/", checkNotAuthenticated, async (req, res) => {
    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email.toLowerCase())) {
        // If the email is not valid, render the signup page with an error message
        return res.render("signup", { locals: { email: req.body.email, emailError: 'Please enter a valid email address.' } });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            // If the email already exists, render the signup page with an error message
            return res.render("signup", { locals: { email: req.body.email, emailError: 'This email is already registered.' } });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email.toLowerCase(),
        });
        try {
            const newUser = await user.save();
            alert("Sign up successful!");
            res.redirect('./login');
        } catch (err) {
            res.redirect('/signup');
        }
    } catch (err) {
        res.redirect('/signup');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('./home');
    }
    next();
}

module.exports = router;