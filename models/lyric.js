var mongoose = require('mongoose');

var lyricSchema = new mongoose.Schema({
    language: String,
    lyrics: String
})

module.exports = mongoose.model('Lyric', lyricSchema);