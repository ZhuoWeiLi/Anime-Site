const express = require('express');
const router = express.Router({ mergeParams: true });
const Show = require('../models/show');
const Screenshot = require('../models/screenshot');
const middleware = require('../middleware')

router.get('/', function(req, res) {
    Show.findById(req.params.id).populate('screenshots').exec(function(err, show) {
        if (err) console.log(err);
        else {
            res.render('screenshots/index', {
                show: show
            });
        }
    })
})

router.get("/new", middleware.userLoggedIn, function(req, res) {
    res.render("screenshots/new")
});

router.post('/', middleware.userLoggedIn, function(req, res) {
    req.body.screenshot.creator = { id: res.locals.user._id, username: res.locals.user.username }
    Screenshot.create(req.body.screenshot, function(err, screenshot) {
        if (err) console.log(err);
        else {
            Show.findById(req.params.id).populate('screenshots').exec(function(err, show) {
                if (err) {
                    console.log(err);
                }
                else {
                    show.screenshots.push(screenshot)
                    show.screenshots.sort((a, b) => {
                        if(!a.episode) {
                            return 1
                        }
                        else if(!b.episode) {
                            return -1
                        }
                        else {
                            return a.episode - b.episode;
                        }
                    })
                    show.save(function() {
                        res.redirect('/shows/' + req.params.id + '/screenshots');
                    });
                }

            });
        }
    });
})

router.use('/:screenshotid*', function(req, res, next) {
    console.log('hi from screenshots')
    Screenshot.findById(req.params.screenshotid, (err, screenshot) => {
        if (err || !screenshot) {
            res.redirect('../screenshots')
        }
        else {
            res.locals.screenshot = screenshot;
            next();
        }

    })
})

router.get('/:screenshotid/edit', middleware.userLoggedIn, middleware.verifyOwnership('screenshot'), function(req, res) {
    res.render('screenshots/edit')
})

router.put('/:screenshotid', middleware.userLoggedIn, middleware.verifyOwnership('screenshot'), function(req, res) {
    Screenshot.findByIdAndUpdate(req.params.screenshotid, req.body.screenshot, function() {
        res.redirect('../screenshots')
    })
})

router.delete('/:screenshotid', middleware.userLoggedIn, middleware.verifyOwnership('screenshot'), function(req, res) {
    Screenshot.findByIdAndRemove(req.params.screenshotid, function() {
        res.redirect('../screenshots')
    })
})




module.exports = router
