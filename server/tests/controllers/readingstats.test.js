import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

const userPassword = process.env.USER_PASSWORD;
const authorPassword = process.env.AUTHOR_PASSWORD;
const adminPassword = process.env.ADMIN_PASSWORD;

const user = {
  email: 'su@mail.com',
  password: userPassword
};
const user2 = {
  email: 'sa@mail.com',
  password: adminPassword
};
const author = {
  email: 'author1@mail.com',
  password: authorPassword
};

let userToken;
let user2Token;
let authorToken;
let articleId;
let articleSlug;

describe('User\'s reading stats', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send(user)
      .end((req, res) => {
        userToken = res.body.user.token;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send(user2)
      .end((req, res) => {
        user2Token = res.body.user.token;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send(author)
      .end((req, res) => {
        authorToken = res.body.user.token;
        done();
      });
  });

  it('Creates an article for an author', (done) => {
    chai.request(app)
      .post('/api/articles')
      .send({ title: 'test-article', body: 'test article body', description: 'article-description' })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authorToken}`)
      .set('Accept', 'application/json')
      .end((req, res) => {
        const { createdArticle } = res.body.newArticleAlert;
        articleId = res.body.newArticleAlert.createdArticle.id;
        articleSlug = res.body.newArticleAlert.createdArticle.slug;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(createdArticle).to.have.property('title');
        expect(createdArticle).to.have.property('description');
        expect(createdArticle).to.have.property('body');
        done();
      });
  });

  it('Add an article to a category', (done) => {
    chai.request(app)
      .post('/api/article-categories/Technology/articles')
      .send({ articleId })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authorToken}`)
      .set('Accept', 'application/json')
      .end((req, res) => {
        const { created } = res.body;
        expect(res).to.have.status(202);
        expect(res.body).to.have.property('status');
        expect(created).to.have.property('articleId');
        expect(created).to.have.property('categoryId');
        done();
      });
  });

  it('Returns an article for a user', (done) => {
    chai.request(app)
      .get(`/api/articles/${articleSlug}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .set('Accept', 'application/json')
      .end((req, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('article');
        done();
      });
  });

  it('Returns a users reading stats', (done) => {
    chai.request(app)
      .get('/api/user-reading-stats')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .set('Accept', 'application/json')
      .end((req, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('articlesRead');
        expect(res.body).to.have.property('numberOfArticlesRead');
        expect(res.body).to.have.property('articleReactions');
        expect(res.body).to.have.property('mostReadCategory');
        done();
      });
  });

  it('Returns a users reading stats for a new user', (done) => {
    chai.request(app)
      .get('/api/user-reading-stats')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user2Token}`)
      .set('Accept', 'application/json')
      .end((req, res) => {
        const { articlesRead, numberOfArticlesRead, articleReactions } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('articlesRead');
        expect(res.body).to.have.property('numberOfArticlesRead');
        expect(res.body).to.have.property('articleReactions');
        expect(articlesRead).to.be.an('array');
        expect(numberOfArticlesRead).to.equal(0);
        expect(articleReactions.liked).to.equal(0);
        expect(articleReactions.disliked).to.equal(0);
        done();
      });
  });
});
