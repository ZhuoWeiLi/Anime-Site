const express = require('express');
const router = express.Router();
const Show = require('../models/show')
const middleware = require('../middleware')



router.get('/', function(req, res) {
    Show.find({}, function(err, shows) {
        if (err) console.log(err);
        else {
            shows.sort(function(a, b) {
                return a.title.localeCompare(b.title);
            })
            res.render('shows/index', {
                shows: shows
            });
        }
    });
});

router.get('/new', middleware.userLoggedIn, function(req, res) {
    res.render('shows/new');
});

router.post('/', middleware.userLoggedIn, function(req, res) {
    req.body.show.creator = {id: res.locals.user._id, username: res.locals.user.username}
    Show.create(req.body.show, function(err, show) {
        if (err) console.log(err);
        else res.redirect('/shows');
    });
});

router.use('/:id*', function(req, res, next) {
    Show.findById(req.params.id, (err, show) => {
        if (err || !show) {
            res.redirect('/shows')
        }
        else {
            res.locals.show = show
            next();
        }

    })
})

router.get('/:id/edit', middleware.userLoggedIn, middleware.verifyOwnership('show'), function(req, res) {
    res.render('shows/edit');
});

router.put('/:id', middleware.userLoggedIn, middleware.verifyOwnership('show'), function(req, res) {
    Show.findByIdAndUpdate(req.params.id, req.body.show, function () {
        res.redirect('./')
    })
})

router.delete('/:id', middleware.userLoggedIn, middleware.verifyOwnership('show'), function(req, res) {
    Show.findByIdAndRemove(req.params.id, function () {
        res.redirect('./')
    })
})




module.exports = router;

