const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');

describe('/artists', () => {
  beforeAll(done => {
    const url = `mongodb://127.0.0.1/test`;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      done();
    });
  });

  describe('POST /artists', () => {
    it('creates a new artist in the database', done => {
      request(app)
        .post('/artists')
        .send({
          name: 'Tame Impala',
          genre: 'Rock',
        })
        .then(res => {
          expect(res.status).toBe(201);

          Artist.findById(res.body._id, artist => {
            expect(artist.name).toBe('Tame Impala');
            expect(artist.genre).toBe('Rock');
            done();
          });
        });
    });
  });

  describe('with artists in the database', () => {
    let artists;
    beforeEach(done => {
      Promise.all([
        Artist.create({ name: 'Tame Impala', genre: 'Rock' }),
        Artist.create({ name: 'Kylie Minogue', genre: 'Pop' }),
        Artist.create({ name: 'Dave Brubeck', genre: 'Jazz' }),
      ]).then(documents => {
        artists = documents;
        done();
      });
    });

    describe('GET /artists', () => {
      it('gets all artist records', done => {
        request(app)
          .get('/artists')
          .end(res => {
            expect(res.status).toBe(200);
            expect(res.body).to.have.lengthOf(3);

            res.body.forEach(artist => {
              const expected = artists.find(a => a._id.toString() === artist._id);
              expect(artist.name).toBe(expected.name);
              expect(artist.genre).toBe(expected.genre);
            });
            done();
          });
      });
    });

    describe('GET /artist/:artistId', () => {
      it('gets artist record by id', done => {
        const artist = artists[0];
        request(app)
          .get(`/artists/${artist._id}`)
          .end(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(artist.name);
            expect(res.body.genre).toBe(artist.genre);
            done();
          });
      });

      it('returns a 404 if the artist does not exist', done => {
        request(app)
          .get('/artists/12345')
          .end(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The artist could not be found.');
            done();
          });
      });
    });

    describe('PATCH /artists/:artistId', () => {
      it('updates artist record by id', done => {
        const artist = artists[0];
        request(app)
          .patch(`/artists/${artist._id}`)
          .send({ genre: 'Psychedelic Rock' })
          .end(res => {
            expect(res.status).toBe(200);
            Artist.findById(artist._id, updatedArtist => {
              expect(updatedArtist.genre).toBe('Psychedelic Rock');
              done();
            });
          });
      });

      it('updates artist record by name', done => {
        const artist = artists[0];
        request(app)
          .patch(`/artists/${artist._id}`)
          .send({ name: 'Lady Gaga' })
          .end(res => {
            expect(res.status).toBe(200);
            Artist.findById(artist._id, updatedArtist => {
              expect(updatedArtist.name).toBe('Lady Gaga');
              expect(updatedArtist.genre).toBe('Rock');
              done();
            });
          });
      });

      it('returns a 404 if the artist does not exist', done => {
        request(app)
          .patch('/artists/12345')
          .send({ genre: 'Psychedelic Rock' })
          .end(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The artist could not be found.');
            done();
          });
      });
    });

    describe('DELETE /artists/:artistId', () => {
      it('deletes artist record by id', done => {
        const artist = artists[0];
        request(app)
          .delete(`/artists/${artist._id}`)
          .end(res => {
            expect(res.status).toBe(204);
            Artist.findById(artist._id, (error, updatedArtist) => {
              expect(error).toBe(null);
              expect(updatedArtist).toBe(null);
              done();
            });
          });
      });

      it('returns a 404 if the artist does not exist', done => {
        request(app)
          .delete('/artists/12345')
          .end(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The artist could not be found.');
            done();
          });
      });
    });
  });
});
