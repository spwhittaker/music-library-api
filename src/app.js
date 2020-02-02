const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const songControllers = require('./controllers/songs');

const app = express();
app.use(express.json());
app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.findArtist);

app.patch('/artists/:id', artistControllers.updateArtist);

app.delete('/artists/:id', artistControllers.deleteArtist);

app.post('/artists/:id/albums', albumControllers.create);

app.post('/album/:albumId/song', songControllers.create);
module.exports = app;
