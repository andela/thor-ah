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

let adminToken;
let userToken;
let authorToken;

describe.only('Categorizes articles', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send(admin)
      .end((req, res) => {
        adminToken = res.body.user.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send(author)
      .end((req, res) => {
        authorToken = res.body.user.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send(user)
      .end((req, res) => {
        userToken = res.body.user.token;
        done();
      });
  });

  // Admin can do CRUD operations for categories
  describe('Accepts CRUD operations from an Admin', () => {
    it.only('Gets all categories for an Admin', (done) => {
      chai.request(app)
        .get('/api/article-categories')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('categories');
          done();
        });
    });

    // Admin can create a new category =======================
    it.only('Creates a new category for an Admin', (done) => {
      chai.request(app)
        .post('/api/article-categories')
        .send({ name: 'Design' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('category');
          expect(res.body.category.name).to.equal('Design');
          done();
        });
    });

    // An admin cannot create a category twice
    it.only('Returns an error if category already exists', (done) => {
      chai.request(app)
        .post('/api/article-categories')
        .send({ name: 'Design' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Article category already exists');
          done();
        });
    });

    // Category name cannot be empty
    it.only('Returns an error if category name is empty', (done) => {
      chai.request(app)
        .put('/api/article-categories/Business')
        .send({ name: '' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Name value cannot be empty');
          done();
        });
    });

    // Admin can update an existing category
    it.only('Updates an existing category for an Admin', (done) => {
      chai.request(app)
        .put('/api/article-categories/Technology')
        .send({ name: 'InfoTech' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(202);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('category');
          expect(res.body.category.name).to.equal('InfoTech');
          done();
        });
    });

    // Admin cannot update a category that does not exist
    it.only('Returns an error if category does not exist', (done) => {
      chai.request(app)
        .put('/api/article-categories/Champion')
        .send({ name: 'InfoTech' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Cannot update a category that does not exist');
          done();
        });
    });

    // Admin cannot update a category with an empty string
    it.only('Returns an error if update is an empty string', (done) => {
      chai.request(app)
        .put('/api/article-categories/Business')
        .send({ name: '' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Name value cannot be empty');
          done();
        });
    });

    // Admin can delete a category
    it.only('Deletes a category for an Admin', (done) => {
      chai.request(app)
        .delete('/api/article-categories/InfoTech')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });

    // Admin cannot delete a category that does not exists
    it.only('Does not delete a category that does not exists', (done) => {
      chai.request(app)
        .delete('/api/article-categories/Socialization')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('You cannot delete a ategory does not exist');
          done();
        });
    });

    // An author can add their article to a category
    it('Adds a category to an article for an Author', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('category');
          expect(res.body.category).to.equal({ name: 'Arts' });
          done();
        });
    });
  });

  /*
  describe.only('Users and authors cannot do CRUD operations on catergories', () => {
    it('Returns an error if a user tries to create a category', (done) => {
      chai.request(app)
        .post('/api/article-categories')
        .send({ name: 'Lifestyle' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.message).to.equal('you are not an Admin');
          done();
        });
    });

    it('Returns an error if an author tries to create a category', (done) => {
      chai.request(app)
        .post('/api/article-categories')
        .send({ name: 'Engineering' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.message).to.equal('you are not an Admin');
          done();
        });
    });
  });
  */
});
