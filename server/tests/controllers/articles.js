import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

// user expected to have been created by tests.controllers.users
const author1Login = {
  email: 'author1@mail.com',
  password: process.env.AUTHOR_PASSWORD
};

// tem test article
const Article = {
  title: 'jbjkka2 kbviu buibi',
  body: 'ibin',
  description: 'kvilbulibvi',
};

// tem test article
const updateArticle = {
  title: 'jbjkka2 kbviu buibi updated',
  body: 'ibin update1 cc',
  description: 'updfated kvilbulibvi',
};

let testSlug = '';
let token = '';

describe('Articles controller', () => {
  describe('createArticle()', () => {
    // get token to use for article route testing
    it('', (done) => {
      chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(author1Login)
        .end((err, resp) => {
          const userToken = resp.body.user.token;
          token = userToken;
          done();
        });
    });

    it('should create and return the created article object', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(Article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          const { article } = res.body;
          article.should.be.an('object');
          article.should.have.property('slug');
          article.should.have.property('title');
          article.should.have.property('description');
          article.should.have.property('body');
          article.should.have.property('createdAt');
          article.should.have.property('updatedAt');
          article.author.should.be.a('object');
          testSlug = article.slug;
          done();
        });
    });

    it('should return error if article title is missing', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'goodies in a box', body: 'full gist' })
        .end((err, res) => {
          res.should.have.status(400);
        });
      done();
    });

    it('should return error if article body is missing', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'goodies in a box', title: 'imaginary tail' })
        .end((err, res) => {
          res.should.have.status(400);
        });
      done();
    });

    it('should return error if article description missing', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'the free goodies', body: 'ended before it began, no such thing' })
        .end((err, res) => {
          res.should.have.status(400);
        });
      done();
    });
  });

  describe('getSpecificArticle()', () => {
    it('should return the article with given slug', (done) => {
      chai.request(server)
        .get(`/api/articles/${testSlug}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          const { article } = res.body;
          article.should.be.an('object');
          article.should.have.property('slug');
          article.should.have.property('title');
          article.should.have.property('description');
          article.should.have.property('body');
          article.should.have.property('createdAt');
          article.should.have.property('updatedAt');
          article.author.should.be.a('object');
          done();
        });
    });
  });

  describe('getAllArticle()', () => {
    it('should return a list of articles', (done) => {
      chai.request(server)
        .get('/api/articles')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.articles.should.be.an('array');
          done();
        });
    });
  });

  describe('updateArticle()', () => {
    it('shouuld uppdate article with the given slug', (done) => {
      chai.request(server)
        .put(`/api/articles/${testSlug}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          const { article } = res.body;
          article.should.be.an('object');
          article.should.have.property('slug');
          article.should.have.property('title');
          article.should.have.property('description');
          article.should.have.property('body');
          article.should.have.property('createdAt');
          article.should.have.property('updatedAt');
          article.author.should.be.a('object');
          testSlug = article.slug;
          done();
        });
    });

    it('shouuld return error erroe if slug not found', (done) => {
      chai.request(server)
        .put('/api/articles/some_wrong_slug')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
