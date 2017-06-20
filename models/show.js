var mongoose = require('mongoose');

var showSchema = new mongoose.Schema({
    title: String,
    screenshots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screenshot"
    }],
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
})

module.exports = mongoose.model('Show', showSchema);
