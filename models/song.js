var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
    title: String,
    link: String,
    vidID: String,
    lyrics: [{type: mongoose.Schema.Types.ObjectId, ref: "Lyric"}]
})

module.exports = mongoose.model('Song', songSchema);