var mongoose = require('mongoose');

var screenshotSchema = new mongoose.Schema({
    image: String,
    episode: Number,
    creator: {
        id: String,
        username: String
    },
})

module.exports = mongoose.model('Screenshot', screenshotSchema);
