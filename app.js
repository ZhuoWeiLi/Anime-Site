const express = require('express'),
    app = express(),
    
    Show = require('./models/show.js'),
    Song = require('./models/song.js'),
    Lyric = require('./models/lyric.js'),
    User = require('./models/user.js'),
    
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),

    seedDB = require('./seeds.js'),
    
    showRoutes = require('./routes/shows'),
    authRoutes = require('./routes/auth'),
    screenshotRoutes = require('./routes/screenshots'),
    songRoutes = require('./routes/songs'),
    lyricRoutes = require('./routes/lyrics')
    

mongoose.Promise = global.Promise;

seedDB();
mongoose.connect("mongodb://localhost/animeme");
app.set('view engine', 'ejs');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('express-session')({
  secret: 'toki o tomare',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use('/shows/:id/*',function(req, res, next){
    Show.findById(req.params.id, (err, show)=> {
        res.locals.show = show
        next();
    })
})

app.use('/shows/:id/songs/:songid/*',function(req, res, next){
    Song.findById(req.params.songid, (err, song)=> {
        res.locals.song = song;
        next();
    })
})

app.use('/shows/:id/songs/:songid/lyrics/:lyricid',function(req, res, next){
    Lyric.findById(req.params.lyricid, (err, lyric)=> {
        res.locals.lyric = lyric;
        next();
    })
})

app.use('/shows', showRoutes);
app.use(authRoutes);
app.use('/shows/:id/screenshots', screenshotRoutes);
app.use('/shows/:id/songs', songRoutes);
app.use('/shows/:id/songs/:songid/lyrics',lyricRoutes)

app.get('/', function(req, res) {
    res.redirect('/shows');
});




app.listen(process.env.PORT, process.env.IP);
