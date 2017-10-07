const express = require('express'),
    app = express(),

    Show = require('./models/show.js'),
    Song = require('./models/song.js'),
    Lyric = require('./models/lyric.js'),
    User = require('./models/user.js'),
    Screenshot = require('./models/screenshot.js'),

    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),

    seedDB = require('./seeds.js'),

    showRoutes = require('./routes/shows'),
    authRoutes = require('./routes/auth'),
    screenshotRoutes = require('./routes/screenshots'),
    songRoutes = require('./routes/songs'),
    lyricRoutes = require('./routes/lyrics')


// seedDB();
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASEURL);
app.set('view engine', 'ejs');


app.use(methodOverride('_method'))
app.use(flash());
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

app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash('success')
    
    next();
});

app.use('/shows', showRoutes);
app.use(authRoutes);
app.use('/shows/:id/screenshots', screenshotRoutes);
app.use('/shows/:id/songs', songRoutes);
app.use('/shows/:id/songs/:songid/lyrics', lyricRoutes)


app.get('/', function(req, res) {
    res.redirect('/shows');
});

app.use('*', function(req, res, next) {
    res.redirect('/shows')
})


app.listen(process.env.PORT, process.env.IP);
