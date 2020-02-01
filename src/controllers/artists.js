const Artist = require('../models/artist');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });
  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find().then(artists => {
    res.status(200).json(artists);
  });
};
exports.findArtist = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.updateArtist = (req, res) => {
  console.log('something');
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      if (req.body.name) {
        artist.set({ name: req.body.name });
      }
      if (req.body.genre) {
        artist.set({ genre: req.body.genre });
      }
      artist.save();

      res.status(200).json(artist);
    }
  });
};

exports.deleteArtist = (req, res) => {
  return Artist.findOneAndRemove({ _id: req.params.id }, (err, artist) => {
    console.log(artist);
    if (err) {
      res.status(404).json({ error: 'The artist could not be found.' });
    }
    return res.status(204);
  });
};
