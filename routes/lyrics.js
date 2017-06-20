const express = require('express');
const router = express.Router({mergeParams: true});
const Song = require('../models/song');
const Lyric = require('../models/lyric')


router.get('/', function(req, res) {
    Song.findById(req.params.songid).populate('lyrics').exec((err, song) => {
        res.render('lyrics/index', {song: song})
    })
    
})

router.get('/new', function(req, res) {
    res.render('lyrics/new')
})

router.post('/', function(req, res) {
    Song.findById(req.params.songid, (err, song) => {
        Lyric.create(req.body.lyric, function(err, lyric){
            song.lyrics.push(lyric)
            song.save(function(err, song){
                res.redirect('../lyrics')
            });
        })
    })
})

router.get('/:lyricid', function(req, res) {
    Lyric.findById(req.params.lyricid, (err, lyric) =>{
        res.render('lyrics/show')
    })
})

module.exports = router;