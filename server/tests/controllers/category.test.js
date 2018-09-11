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

const author2 = {
  email: 'author2@mail.com',
  password: authorPassword
};

const user = {
  email: 'su@mail.com',
  password: userPassword,
};

let adminToken;
let userToken;
let authorToken;
let author2Token;

describe('Categorizes articles', () => {
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

  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send(author2)
      .end((req, res) => {
        author2Token = res.body.user.token;
        done();
      });
  });


  // Admin can do CRUD operations for categories
  describe('Accepts CRUD operations from an Admin', () => {
    it('Gets all categories for an Admin', (done) => {
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
    it('Creates a new category for an Admin', (done) => {
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

    // An admin cannot create a category twice ==========================
    it('Returns an error if category already exists', (done) => {
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

    // Category name cannot be empty =====================================
    it('Returns an error if category name is empty', (done) => {
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

    // Admin can update an existing category ============================
    it('Updates an existing category for an Admin', (done) => {
      chai.request(app)
        .put('/api/article-categories/Entrepreneurship')
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

    // Admin cannot update a category that does not exist ==================
    it('Returns an error if category does not exist', (done) => {
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

    // Admin cannot update a category with an empty string =================
    it('Returns an error if update is an empty string', (done) => {
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

    // Admin can delete a category =================================
    it('Deletes a category for an Admin', (done) => {
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

    // Admin cannot delete a category that does not exists ====================
    it('Does not delete a category that does not exists', (done) => {
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
  });

  describe('Author can add their article to any category', () => {
    // An author can post an article ============================
    it('Posts an article for an Author', (done) => {
      chai.request(app)
        .post('/api/articles')
        .send({ title: 'coding', body: 'coding is fun', description: 'coding is fun' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('newArticleAlert');
          expect(res.body.newArticleAlert.createdArticle.title).to.equal('coding');
          expect(res.body.newArticleAlert.createdArticle.body).to.equal('coding is fun');
          expect(res.body.newArticleAlert.createdArticle.description).to.equal('coding is fun');
          done();
        });
    });

    // An author can add their article to a category ============================
    it('Adds an author\'s article to a category', (done) => {
      chai.request(app)
        .post('/api/article-categories/Technology')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(202);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('created');
          expect(res.body.created).to.have.property('articleId');
          expect(res.body.created).to.have.property('categoryId');
          expect(res.body.created).to.have.property('updatedAt');
          expect(res.body.created).to.have.property('createdAt');
          done();
        });
    });

    // Author cannot add the same article twice
    it('Returns an error if author tries to add another author\'s article', (done) => {
      chai.request(app)
        .post('/api/article-categories/Technology')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(409);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('Article has already been added to this Category');
          done();
        });
    });

    // Author cannot add article to a category that does not exist
    it('Returns an error if author author\'s article to category that does not exist', (done) => {
      chai.request(app)
        .post('/api/article-categories/Headphones')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(404);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('Category does not exist');
          done();
        });
    });

    // Author cannot add an article that does not exist
    it('Returns an error if article does not exist', (done) => {
      chai.request(app)
        .post('/api/article-categories/Technology')
        .send({ articleTitle: 'eating while working' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(404);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('Article does not exist');
          done();
        });
    });

    // Author cannot add another user's article to any category
    it('Returns an error if author tries to add another author\'s article', (done) => {
      chai.request(app)
        .post('/api/article-categories/Technology')
        .send({ articleTitle: 'test article' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${author2Token}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(403);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('You cannot modify another author\'s article');
          done();
        });
    });

    // Author can remove his article from any category
    it('Removes author\'s article from a category', (done) => {
      chai.request(app)
        .delete('/api/article-categories/Technology/articles')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(202);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Your article has been removed from Technology');
          done();
        });
    });

    // Author cannot remove another author's article from any category
    it('Removes author\'s article from a category', (done) => {
      chai.request(app)
        .delete('/api/article-categories/Technology/articles')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${author2Token}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(403);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('You cannot remove another author\'s article from this category');
          done();
        });
    });

    // Author cannot remove an article from a category twice
    it('Returns an error if author tries to remove article from a category twice', (done) => {
      chai.request(app)
        .delete('/api/article-categories/Technology/articles')
        .send({ articleTitle: 'coding' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authorToken}`)
        .set('Content-Type', 'application/json')
        .end((req, res) => {
          expect(res).to.have.status(404);
          expect(res).to.have.property('status');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.equal('You cannot remove an article that does not exists in this category');
          done();
        });
    });
  });
});
