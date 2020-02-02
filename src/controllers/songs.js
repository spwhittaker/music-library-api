const Song = require('../models/song');
const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  Album.findOne({ _id: req.params.albumId }, (err, album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      Artist.findOne({ _id: album.artist }, (err, artist) => {
        const song = new Song({
          name: req.body.name,
          artist: artist,
          album: album,
        });
        song.save().then(() => res.status(200).json(song));
      });
    }
  });
};
