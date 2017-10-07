const express = require('express');
const router = express.Router({ mergeParams: true });
const Show = require('../models/show');
const Song = require('../models/song');
const url = require('url');
const middleware = require('../middleware')


function setVidID(songObject) {
    const URL = new url.URL(songObject.link)
    const base = URL.origin;
    const v = URL.searchParams.get('v')
    songObject.vidID = v;
}

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

router.get('/new', middleware.userLoggedIn, function(req, res) {
    res.render('songs/new')
})

router.post('/', middleware.userLoggedIn, function(req, res) {
    req.body.song.creator = { id: res.locals.user._id, username: res.locals.user.username }
    setVidID(req.body.song)
    Song.create(req.body.song, function(err, song) {
        if (err) return res.redirect('/shows/' + res.params.id + '/songs/new')
        res.locals.show.songs.push(song);
        res.locals.show.save(function() {
            res.redirect('/shows/' + req.params.id + '/songs');
        })
    })
})

router.use('/:songid*', function(req, res, next) {
    Song.findById(req.params.songid, (err, song) => {
        if (err || !song) {
            res.redirect('../songs')
        }
        else {
            res.locals.song = song;
            next();
        }

    })
})

router.get('/:songid/edit', middleware.userLoggedIn, middleware.verifyOwnership('song'), function(req, res) {
    res.render('songs/edit')
})

router.put('/:songid', middleware.userLoggedIn, middleware.verifyOwnership('song'), function(req, res) {
    setVidID(req.body.song)
    Song.findByIdAndUpdate(req.params.songid, req.body.song, function() {
        res.redirect('../songs')
    })
})

router.delete('/:songid', middleware.userLoggedIn, middleware.verifyOwnership('song'), function(req, res) {
    Song.findByIdAndRemove(req.params.songid, function() {
        res.redirect('../songs')
    })
})

module.exports = router;
