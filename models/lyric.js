var mongoose = require('mongoose');

var lyricSchema = new mongoose.Schema({
    language: String,
    lyrics: String,
    creator: {
        id: String,
        username: String
    },
})

module.exports = mongoose.model('Lyric', lyricSchema);
