const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('Test routes', () => {
beforeEach(done => connection.query('TRUNCATE bookmark', done));
  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { message: 'Hello World!'};
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks champs manquant', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = {"error": "required field(s) missing"};
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks champs ok', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://jestjs.io', title: 'Jest' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { id: expect.any(Number), url: 'https://jestjs.io', title: 'Jest' };

        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
});

describe('GET /bookmark/:id', () => {
    const testBookmark = { url: 'https://jestjs.io', title: 'Jest' };
    beforeEach((done) => connection.query(
        'TRUNCATE bookmark', () => connection.query(
            'INSERT INTO bookmark SET ?', testBookmark, done
        )
    ));

    it('GET / NO - bookmark introuvable', (done) => {
        request(app)
        .get('/bookmark/:id')
        .send({})
        .expect(404)
        .expect('Content-Type', /json/)
        .then(response => {
            const expected = { error: 'Bookmark not found' };
            expect(response.body).toEqual(expected);
            done();
        });
    });

    it('GET / OK - bookmark trouvé', (done) => {
        request(app)
        .get('/bookmark/1')
        .send(testBookmark)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
            const expected = {  id: 1, url: 'https://jestjs.io', title: 'Jest' };
            expect(response.body).toEqual(expected);
            done();
        });
    });
});