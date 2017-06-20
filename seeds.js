var mongoose = require('mongoose')
var Show = require('./models/show')
var Screenshot = require('./models/screenshot')
var Song = require('./models/song')

var data = [{
    title: 'Shingeki no Kyojin',
    screenshots: []
}, {
    title: 'Tsuki ga Kirei',
    screenshots: []
}];


function seedDB() {
    Show.remove({}, function(err) {
        if (err) console.log(err);
        else {
            data.forEach(function(show) {
                Show.create(show, function(err, show) {
                    if (err) console.log(err)
                    else {
                        for (var i = 0; i < 5; i++) {

                            Screenshot.create({
                                image: 'https://68.media.tumblr.com/5f0d8bc077672a8ac64ee75ed4773bcc/tumblr_oqjqs4JsA11r3ifxzo1_500.png',
                                episode: 7
                            }, function(err, screenshot) {
                                if (err) console.log(err);
                                else {
                                    show.screenshots.push(screenshot)
                                    Song.create({
                                        title: 'Sangatsu Kokonoka',
                                        link: "https://www.youtube.com/embed/NUHZAajgRCA",
                                        vidID: 'NUHZAajgRCA'
                                    }, function(err, song) {
                                        show.songs.push(song);
                                        show.save()
                                    })

                                }


                            })

                        }
                    }
                })
            })

        }
    })
}

module.exports = seedDB;
