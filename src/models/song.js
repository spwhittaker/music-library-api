const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  artist: Object,
  album: Object,
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
