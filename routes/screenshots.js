const express = require('express');
const router = express.Router({mergeParams: true});
const Show = require('../models/show');
const Screenshot = require('../models/screenshot');


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

router.get("/new", function(req, res) {
    // find campground by id
    Show.findById(req.params.id, function(err, show) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("screenshots/new", {
                show: show
            });
        }
    })
});

router.post('/screenshots', function(req, res) {
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
                            return a.episode - b.episode;
                        })
                    show.save(function(err) {
                    res.redirect('/shows/' + req.params.id + '/screenshots');
                });
            }

        });
}
});
})

module.exports = router