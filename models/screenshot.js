var mongoose = require('mongoose');

var screenshotSchema = new mongoose.Schema({
    image: String,
    episode: Number
})

module.exports = mongoose.model('Screenshot', screenshotSchema);