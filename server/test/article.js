import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';
import server from '../../index';

import articleModel from '../models/article';

chai.should();

chai.use(chaiHttp);


describe('Articles model', () => {

});


describe('article model', () => {
  const Article = articleModel(sequelize, dataTypes);
  const article = new Article();

  checkModelName(Article)('Article');

  // test user model properties
  context('article model properties', () => {
    [
      'title',
      'slug',
      'description',
      'authorId',
      'likeDislikeId'
    ].forEach(checkPropertyExists(article));
  });
});

// tem test article
const Article = {
  title: 'jbjkka2 kbviu buibi',
  body: 'ibin',
  description: 'kvilbulibvi',
  authorId: 1
};

// tem test article
const updateArticle = {
  title: 'jbjkka2 kbviu buibi updated',
  body: 'ibin update1 cc',
  description: 'updfated kvilbulibvi',
};

/**
 * @static
 * @param {object} User
 * @return {response} res
 * @description to create a user to enable test run (create article needs an author for article).
*/
function signupTestUser(User) {
  chai.request(server)
    .post('/api/articles')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(User);
}

// signup test user
signupTestUser({
  username: 'laura2',
  email: 'me@me.com',
  password: '0000000000p'
});


let testSlug = '';

describe('Articles controller', () => {
  describe('createArticle()', () => {
    it('should rcreate and return the created article object', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(Article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.article.should.be.an('object');
          res.body.article.should.have.property('slug');
          res.body.article.should.have.property('title');
          res.body.article.should.have.property('description');
          res.body.article.should.have.property('body');
          res.body.article.should.have.property('createdAt');
          res.body.article.should.have.property('updatedAt');
          res.body.article.author.should.be.a('object');
          testSlug = res.body.article.slug;
          done();
        });
    });

    it('should return error if article title is missing', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
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
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.article.should.be.an('object');
          res.body.article.should.have.property('slug');
          res.body.article.should.have.property('title');
          res.body.article.should.have.property('description');
          res.body.article.should.have.property('body');
          res.body.article.should.have.property('createdAt');
          res.body.article.should.have.property('updatedAt');
          res.body.article.author.should.be.a('object');
          done();
        });
    });
  });

  describe('getAllArticle()', () => {
    it('should return a list of articles', (done) => {
      chai.request(server)
        .get('/api/articles')
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
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.article.should.be.an('object');
          res.body.article.should.have.property('slug');
          res.body.article.should.have.property('title');
          res.body.article.should.have.property('description');
          res.body.article.should.have.property('body');
          res.body.article.should.have.property('createdAt');
          res.body.article.should.have.property('updatedAt');
          res.body.article.author.should.be.a('object');
          testSlug = res.body.article.slug;
          done();
        });
    });

    it('shouuld return error erroe if slug not found', (done) => {
      chai.request(server)
        .put('/api/articles/some_wrong_slug')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
