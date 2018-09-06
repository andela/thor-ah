import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

let articleId;
const wrongArticleId = 22;
let userToken;
let secondUserToken;
const article = {
  title: 'This is the title for a simple article',
  body: 'This one should be a very long that all other attributes since it is the main content of the article. I think description should be removed and it should be generated from article body',
  description: "This one is describing this particular article but it's not necessary"
};
const articleAuthor = {
  email: 'author1@mail.com',
  password: process.env.AUTHOR_PASSWORD,
};
const secondArticleAuthor = {
  email: 'su@mail.com',
  password: process.env.USER_PASSWORD,
};

describe('likeDislike Controller', () => {
  describe('POST likeDislike', () => {
    it('should log author in for test', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(articleAuthor)
        .end((err, res) => {
          userToken = res.body.user.token;
          done();
        });
    });
    it('should log user in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(secondArticleAuthor)
        .end((err, res) => {
          secondUserToken = res.body.user.token;
          done();
        });
    });
    it('should create article for test', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(article)
        .end((err, res) => {
          articleId = res.body.newArticleAlert.createdArticle.id;
          done();
        });
    });
    it('should return error if token is invalid', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          res.body.error.should.be.a('object');
          res.body.error.message.should.equal('no token provided');
          done();
        });
    });
    it('should return error if article does not exist', (done) => {
      chai.request(app)
        .post(`/api/articles/${wrongArticleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: 'like' })
        .end((err, res) => {
          res.body.status.should.equal('error');
          res.body.message.should.equal('Article was not found.');
          done();
        });
    });
    it('should return error if reaction is invalid or not provided', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: '' })
        .end((err, res) => {
          res.body.status.should.equal('error');
          res.body.message.should.equal('No reaction provided.');
          done();
        });
    });
    it('should successfully like an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: 'like' })
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Article liked successfully.');
          done();
        });
    });
    it('should successfully dislike an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: 'dislike' })
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Article disliked successfully.');
          done();
        });
    });
    it('should remove like or dislike if article\'s incoming status and current status is the same', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: 'dislike' })
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Reaction removed.');
          done();
        });
    });
  });

  describe('GET reaction status', () => {
    it('should return error if user is not authenticated', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/reactions/status`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          res.body.error.should.be.a('object');
          res.body.error.message.should.equal('no token provided');
          done();
        });
    });
    it('should return error if article does not exist', (done) => {
      chai.request(app)
        .get('/api/articles/22/reactions/status')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Article was not found.');
          done();
        });
    });
    it('should return success with reaction', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/reactions/status`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.message.should.equal('You have not reacted to this article.');
          done();
        });
    });
    it('should dislike the article for test', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ reaction: 'dislike' })
        .end((err, res) => {
          res.body.status.should.equal('success');
          done();
        });
    });
    it('should like the article for test', (done) => {
      chai.request(app)
        .post(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reaction: 'like' })
        .end((err, res) => {
          res.body.status.should.equal('success');
          done();
        });
    });
    it('should return success with reaction', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/reactions/status`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.reaction.should.equal('dislike');
          done();
        });
    });
    it('should return success with reaction', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/reactions/status`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.reaction.should.equal('like');
          done();
        });
    });
  });
  describe('GET likeDislike', () => {
    it('should return ratings/reactions for an article', (done) => {
      chai.request(app)
        .get(`/api/articles/${articleId}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.reactions.should.be.a('object');
          done();
        });
    });
  });
});
