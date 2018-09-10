import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

const rightArticleSlug = {};
let wrongArticleSlug;
let userToken;
let authorToken;
const article = {
  title: 'This is the title for a simple article',
  body: 'This one should be a very long that all other attributes since it is the main content of the article. I think description should be removed and it should be generated from article body',
  description: "This one is describing this particular article but it's not necessary"
};
const articleAuthor = {
  email: 'author1@mail.com',
  password: process.env.AUTHOR_PASSWORD,
};
const testUser = {
  email: 'author2@mail.com',
  password: process.env.AUTHOR_PASSWORD,
};

describe('likeDislike Controller', () => {
  before(() => {
    it('should log author in for test', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(articleAuthor)
        .end((err, res) => {
          authorToken = res.body.user.token;
          done();
        });
    });
    it('should log user in for test', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(testUser)
        .end((err, res) => {
          userToken = res.body.user.token;
          done();
        });
    });
    it('should create article for test', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .send(article)
        .end((err, res) => {
          rightArticleSlug.like = res.body.article.slug;
          done();
        });
    });
    it('should create article for test', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .send(article)
        .end((err, res) => {
          rightArticleSlug.dislike = res.body.article.slug;
          done();
        });
    });
  });
  describe('likeDislike', () => {
    it('should return error if token is invalid', (done) => {
      chai.request(app)
        .post(`/api/articles/${rightArticleSlug}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          res.body.status.should.equal('error');
          done();
        });
    });
    it('should return error if article does not exist', (done) => {
      chai.request(app)
        .post(`/api/articles/${wrongArticleSlug}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'like' })
        .end((err, res) => {
          res.body.status.should.equal('error');
          res.body.message.should.equal('Sorry, article does not exist.');
          done();
        });
    });
    it('should successfully like an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${rightArticleSlug.like}/reactions`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Article liked.');
          done();
        });
    });
    it('should successfully dislike an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${rightArticleSlug.dislike}/dislikes`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Article disliked.');
          done();
        });
    });
    it('should remove like or dislike if article\'s incoming status and current status is the same', (done) => {
      chai.request(app)
        .post(`/api/articles/${rightArticleSlug.like}/likes`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.body.status.should.equal('success');
          res.body.message.should.equal('Article liked.');
          done();
        });
    });
  });
});
