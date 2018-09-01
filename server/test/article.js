import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';

chai.should();

chai.use(chaiHttp);

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

let testSlug = '';

describe('API Article endpoints test', () => {
  describe('POST create new article /api/articles', () => {
    it('should retrun a status code 201 with the created article object', (done) => {
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

    it('should return error code 400 if article title is missing', (done) => {
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

    it('should return error code 400 if article body is missing', (done) => {
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

    it('should return error code 400 if article description missing', (done) => {
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

  describe('Get specific article /api/articles/article_slug', () => {
    it('should return an article with given slug', (done) => {
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

  describe('Get all articles /api/articles', () => {
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

  describe('PUT update to article /articles/arti_slug ', () => {
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

    it('shouuld uppdate article with the given slug', (done) => {
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
