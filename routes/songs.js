const express = require('express');
const router = express.Router({mergeParams: true});
const Show = require('../models/show');
const Song = require('../models/song');
const url = require('url');


router.get('/', function(req, res) {
    Show.findById(req.params.id).populate('songs').exec(function(err, show) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('songs/index', {
                show: show
            });
        }
    })

})

router.get('/new', function(req, res) {
    res.render('songs/new')
})

router.post('/', function(req, res) {
    const URL = new url.URL(req.body.song.link)
    const base = URL.origin;
    const v = URL.searchParams.get('v')
    req.body.song.vidID = v;
    req.body.song.link = base + '/embed/' + v
    Song.create(req.body.song, function(err, song) {
        if (err) return res.redirect('/shows/' + res.params.id + '/songs/new')
        res.locals.show.songs.push(song);
        res.locals.show.save(function() {
        res.redirect('/shows/' + req.params.id + '/songs');
        })
    })
})

module.exports = router;