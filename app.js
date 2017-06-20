const express = require('express'),
    app = express(),
    
    Show = require('./models/show.js'),
    Song = require('./models/song.js'),
    Lyric = require('./models/lyric.js'),
    Screenshot = require('./models/screenshot.js'),
    
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

    seedDB = require('./seeds.js'),
    
    showRoutes = require('./routes/shows'),
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


app.use('/shows', showRoutes);
app.use('/shows/:id/screenshots', screenshotRoutes);
app.use('/shows/:id/songs', songRoutes);
app.use('/shows/:id/songs/:songid/lyrics',lyricRoutes)

app.get('/', function(req, res) {
    res.redirect('/shows');
});




app.listen(process.env.PORT, process.env.IP);
