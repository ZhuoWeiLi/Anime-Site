const express = require('express');
const router = express.Router();
const Show = require('../models/show')

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

router.get('/new', function(req, res) {
    res.render('shows/new');
});

router.post('/', function(req, res) {
    Show.create(req.body.show, function(err, show) {
        if (err) console.log(err);
        else res.redirect('/shows');
    });
});



module.exports = router;

