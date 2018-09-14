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
const author2Login = {
  email: 'author2@mail.com',
  password: process.env.AUTHOR_PASSWORD
};

// article for test
const Article = {
  title: 'jbjkka2 kbviu buibi',
  body: 'ibin',
  description: 'kvilbulibvi'
};

const Article2 = {
  title: 'A short story',
  body: 'This story is ssooooo short',
  description: 'short',
  tags: [1]
};

const Article3 = {
  title: 'A short story',
  body: 'This story is ssooooo short',
  description: 'short',
  tags: [1, 2, 3, 4, 5, 6]
};

// tem test article
const updateArticle = {
  title: 'jbjkka2 kbviu buibi updated',
  body: 'ibin update1 cc',
  description: 'updfated kvilbulibvi',
};

const tag = { tag: 'andela' };
const emptyTag = { tag: '' };

let testSlug = '';
let { token1, token2 } = '';

describe('Articles controller', () => {
  describe('createArticle()', () => {
    // get token to use for article route testing
    before((done) => {
      chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(author1Login)
        .end((err, resp) => {
          token1 = resp.body.user.token;
          done();
        });
    });

    // get second author token for article route testing
    before((done) => {
      chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(author2Login)
        .end((err, resp) => {
          token2 = resp.body.user.token;
          done();
        });
    });

    it('should be able to create article tags', (done) => {
      chai.request(server)
        .post('/api/articles/tags')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .set('Content-Type', 'application/json')
        .send(tag)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.newTag[0].tag.should.equal('andela');
          res.body.status.should.equal('success');
          done();
        });
    });

    it('should return error if tag name field is empty', (done) => {
      chai.request(server)
        .post('/api/articles/tags')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .set('Content-Type', 'application/json')
        .send(emptyTag)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.tag.should.equal('Tag name is required');
          res.body.status.should.equal('error');
          done();
        });
    });

    it('should create and return the created article object', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .set('Content-Type', 'application/json')
        .send(Article)
        .end((err, res) => {
          res.should.have.status(200);
          const { createdArticle, author } = res.body.newArticleAlert;
          createdArticle.should.be.a('object');
          createdArticle.should.be.an('object');
          createdArticle.should.have.property('slug');
          createdArticle.should.have.property('title');
          createdArticle.should.have.property('description');
          createdArticle.should.have.property('body');
          createdArticle.should.have.property('tags');
          createdArticle.should.have.property('createdAt');
          createdArticle.should.have.property('updatedAt');
          author.should.be.a('object');
          testSlug = createdArticle.slug;
          res.body.status.should.equal('success');
          done();
        });
    });

    it('should be able to create articles with tags', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .set('Content-Type', 'application/json')
        .send(Article2)
        .end((err, res) => {
          res.should.have.status(200);
          const { createdArticle } = res.body.newArticleAlert;
          createdArticle.should.be.a('object');
          createdArticle.should.be.an('object');
          createdArticle.should.have.property('slug');
          createdArticle.should.have.property('title');
          createdArticle.should.have.property('description');
          done();
        });
    });

    it('should return error if tag is more than 5', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .set('Content-Type', 'application/json')
        .send(Article3)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.message.should.equal('Article tags must not exceed 5');
          done();
        });
    });

    it('should return error if article title is missing', (done) => {
      chai.request(server)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
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
        .set('Authorization', `Bearer ${token1}`)
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
        .set('Authorization', `Bearer ${token1}`)
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
        .set('Authorization', `Bearer ${token1}`)
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

  describe('getAllArticle(s)', () => {
    it('should return a list of articles, 4 per page when no limit is specified', (done) => {
      chai.request(server)
        .get('/api/articles')
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.articles.should.be.an('Array');
          done();
        });
    });
    it('should return a list of articles on the next page given a page limit', (done) => {
      chai.request(server)
        .get('/api/articles/?page=2&limit=4')
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.articles.should.be.an('Array');
          done();
        });
    });
  });

  describe('updateArticle()', () => {
    it('should update article with the given slug', (done) => {
      chai.request(server)
        .put(`/api/articles/${testSlug}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
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

    it('should return error if slug not found', (done) => {
      chai.request(server)
        .put('/api/articles/some_wrong_slug')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token1}`)
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('should return error if author is not the author of the article', (done) => {
      chai.request(server)
        .put(`/api/articles/${testSlug}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token2}`)
        .send(updateArticle)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('should return error if article belongs to different author', (done) => {
      chai.request(server)
        .delete(`/api/articles/${testSlug}`)
        .set('Authorization', `Bearer ${token2}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.error.message.should.equal('forbidden from deleting another user\'s article');
          done();
        });
    });

    it('should delete article with the given slug', (done) => {
      chai.request(server)
        .delete(`/api/articles/${testSlug}`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return error if article does not exist', (done) => {
      chai.request(server)
        .delete(`/api/articles/${testSlug}e`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.message.should.equal('article not found');
          done();
        });
    });
  });

  // tests for article search
  describe('search()', () => {
    it('should return error if no search parameter provided', (done) => {
      chai.request(server)
        .get('/api/articles/search')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.equal('error');
          res.body.should.have.property('error');
          res.body.error.message.should.equal('no search parameter supplied');
          done();
        });
    });

    it('should return a list of articles associated with given tag(s)', (done) => {
      chai.request(server)
        .get(`/api/articles/search?tag=${tag.tag}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.equal('success');
          res.body.articles.should.be.an('Array');
          done();
        });
    });

    it('should return a list of articles relating to given keywords', (done) => {
      chai.request(server)
        .get('/api/articles/search?keywords=short')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.equal('success');
          res.body.articles.should.be.an('Array');
          done();
        });
    });

    it('should return a list of articles by given authors matching supplied author', (done) => {
      chai.request(server)
        .get('/api/articles/search?author=autho')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.equal('success');
          res.body.articles.should.be.an('Array');
          done();
        });
    });
  });
});
