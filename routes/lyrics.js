const express = require('express');
const router = express.Router({ mergeParams: true });
const Song = require('../models/song');
const Lyric = require('../models/lyric')
const middleware = require('../middleware')

router.get('/', function(req, res) {
    Song.findById(req.params.songid).populate('lyrics').exec((err, song) => {
        res.render('lyrics/index', { song: song })
    })

})

router.get('/new', middleware.userLoggedIn, function(req, res) {
    res.render('lyrics/new')
})

router.post('/', middleware.userLoggedIn, function(req, res) {
    req.body.lyric.creator = { id: res.locals.user._id, username: res.locals.user.username }
    Lyric.create(req.body.lyric, function(err, lyric) {
        console.log(res.locals.show)
        res.locals.song.lyrics.push(lyric)
        res.locals.song.save(function() {
            res.redirect('../lyrics')
        })
    })
})

router.get('/:lyricid', function(req, res) {
    res.render('lyrics/show')
})

router.use('/:lyricid*', function(req, res, next) {
    Lyric.findById(req.params.lyricid, (err, lyric) => {
        if (err || !lyric) {
            res.redirect('../lyrics')
        }
        else {
            res.locals.lyric = lyric;
            next();
        }

    })
})

router.get('/:lyricid/edit', middleware.userLoggedIn, middleware.verifyOwnership('lyric'), function(req, res) {
    res.render('lyrics/edit');
});

router.put('/:lyricid', middleware.userLoggedIn, middleware.verifyOwnership('lyric'), function(req, res) {
    Lyric.findByIdAndUpdate(req.params.lyricid, req.body.lyric, function() {
        res.redirect('../lyrics')
    })
})

router.delete('/:lyricid', middleware.userLoggedIn, middleware.verifyOwnership('lyric'), function(req, res) {
    Lyric.findByIdAndRemove(req.params.lyricid, function() {
        res.redirect('../lyrics')
    })
})



module.exports = router;
