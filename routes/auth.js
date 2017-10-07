const express = require('express');
const router = express.Router({
    mergeParams: true
});
const User = require('../models/user');
const passport = require("passport");

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', 'Registration failed, most likely this username has been taken')
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                req.flash('success', 'Registration successful')
                res.redirect('/shows')
            });
        }

    });
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.get("/signout", function(req, res) {
    req.logout();
    res.redirect("back");
});

module.exports = router;
