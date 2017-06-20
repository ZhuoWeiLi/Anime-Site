var express = require('express'),
    app = express(),
    Show = require('./models/show.js'),
    Song = require('./models/song.js'),
    Lyric = require('./models/lyric.js'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Screenshot = require('./models/screenshot.js'),
    url = require('url'),
    seedDB = require('./seeds.js');

mongoose.Promise = global.Promise;

seedDB();
mongoose.connect("mongodb://localhost/animeme");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function(req, res) {
    res.redirect('/shows');
});

app.get('/shows', function(req, res) {
    Show.find({}, function(err, shows) {
        if (err) console.log(err);
        else {
            console.log(shows)
            shows.sort(function(a, b) {
                return a.title.localeCompare(b.title);
            })
            res.render('shows/index', {
                shows: shows
            });
        }
    });
});

app.get('/shows/new', function(req, res) {
    res.render('shows/new');
});

app.post('/shows', function(req, res) {
    Show.create(req.body.show, function(err, show) {
        if (err) console.log(err);
        else res.redirect('/shows');
    });
});

app.get('/shows/:id/screenshots', function(req, res) {
    Show.findById(req.params.id).populate('screenshots').exec(function(err, show) {
        if (err) console.log(err);
        else {
            res.render('screenshots/index', {
                show: show
            });
        }
    })
})

app.get("/shows/:id/screenshots/new", function(req, res) {
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

app.post('/shows/:id/screenshots', function(req, res) {
Screenshot.create(req.body.screenshot, function(err, screenshot) {
        if (err) console.log(err);
        else {
            Show.findById(req.params.id).populate('screenshots').exec(function(err, show) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        show.screenshots.push(screenshot)
                        console.log(show)
                        show.screenshots.sort((a, b) => {
                            return a.episode - b.episode;
                        })
                        console.log(show)
                    show.save(function(err) {
                    res.redirect('/shows/' + req.params.id + '/screenshots');
                });
            }

        });
}
});
})

app.get('/shows/:id/songs', function(req, res) {
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

app.get('/shows/:id/songs/new', function(req, res) {
    res.render('songs/new')
})

app.post('/shows/:id/songs', function(req, res) {
    const URL = new url.URL(req.body.song.link)
    const base = URL.origin;
    const v = URL.searchParams.get('v')
    req.body.song.vidID = v;
    req.body.song.link = base + '/embed/' + v
    Song.create(req.body.song, function(err, song) {
        if (err) return res.redirect('/shows/' + res.params.id + '/songs/new')
        Show.findById(req.params.id).exec().then((show) => {
            console.log(song);
            show.songs.push(song);
            show.save(function() {
                res.redirect('/shows/' + req.params.id + '/songs');
            })
        })
    })
})


app.get('/shows/:id/songs/:songid/lyrics', function(req, res) {
    Song.findById(req.params.songid).populate('lyrics').exec((err, song) => {
        res.render('lyrics/index', {song: song})
    })
    
})

app.get('/shows/:id/songs/:songid/lyrics/new', function(req, res) {
    res.render('lyrics/new')
})

app.post('/shows/:id/songs/:songid/lyrics', function(req, res) {
    Song.findById(req.params.songid, (err, song) => {
        console.log(req.body.lyric)
        Lyric.create(req.body.lyric, function(err, lyric){
            console.log(lyric)
            song.lyrics.push(lyric)
            song.save(function(err, song){
                res.redirect('../lyrics')
            });
        })
    })
})

app.get('/shows/:id/songs/:songid/lyrics/:lyricid', function(req, res) {
    res.render('lyrics/show')
})




app.listen(process.env.PORT, process.env.IP);
