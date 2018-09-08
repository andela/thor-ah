import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

const adminPassword = process.env.ADMIN_PASSWORD;
const authorPassword = process.env.AUTHOR_PASSWORD;
const userPassword = process.env.USER_PASSWORD;

const admin = {
  email: 'sa@mail.com',
  password: adminPassword,
};

const author = {
  email: 'author1@mail.com',
  password: authorPassword,
};

const user = {
  email: 'su@mail.com',
  password: userPassword,
};

describe.only('Categorize articles', () => {
  it('Gets all categories', (done) => {
    chai.request(app)
      .get('/api/article-categories')
      .end((req, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal.property('success');
        expect(res.body).to.have.property('categories');
        done();
      });
  });

  it('Creates a new category for an Admin', (done) => {
    chai.request(app)
      .post('/api/article-categories')
      .send({ name: 'Arts' })
      .end((req, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('category');
        expect(res.body.category).to.equal({ name: 'Arts' });
        done();
      });
  });

  it('Updates an existing category for an Admin', (done) => {
    chai.request(app)
      .put('/api/article-categories/2')
      .send({ name: 'Arts' })
      .end((req, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('category');
        expect(res.body.category).to.equal({ name: 'Arts' });
        done();
      });
  });

  it('Deletes a category for an Admin', (done) => {
    chai.request(app)
      .delete('/api/article-categories/1')
      .end((req, res) => {
        expect(res).to.have.status(204);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('category');
        expect(res.body.category).to.equal({ name: 'Arts' });
        done();
      });
  });

  it('Adds a category to an article for an Author', (done) => {
    chai.request(app)
      .post('/api/articles')
      .end((req, res) => {
        expect(res).to.have.status(204);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('category');
        expect(res.body.category).to.equal({ name: 'Arts' });
        done();
      });
  });
});
