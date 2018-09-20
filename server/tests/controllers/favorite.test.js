
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

const userLogin = {
  email: 'su@mail.com',
  password: process.env.USER_PASSWORD
};

let { token1 } = '';

describe('FavoriteArticleController', () => {
  // get token for accessing the route
  it('generates a token for accessing the route', (done) => {
    chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(userLogin)
      .end((err, res) => {
        token1 = res.body.user.token;
        done();
      });
  });
  it('should return 201 for successfully adding articles to personal favorite list', (done) => {
    chai.request(server)
      .post('/api/article/1/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.message.should.equal('This article is added to your favorite list');
        res.body.status.should.equal('success');
        done();
      });
  });

  it('should return 409 if article is already in user\'s favorite list', (done) => {
    chai.request(server)
      .post('/api/article/1/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.error.message.should.equal('you have favorited this article already');
        res.body.status.should.equal('error');
        done();
      });
  });

  it('should return 500 if an error occured', (done) => {
    chai.request(server)
      .post('/api/article/b/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.status.should.equal('error');
        done();
      });
  });

  it('should return 200 when the list of favorite articles are returned', (done) => {
    chai.request(server)
      .get('/api/user/articles/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Your favorite articles');
        res.body.status.should.equal('success');
        done();
      });
  });

  it('should return 200 when a favorited article is deleted by the user', (done) => {
    chai.request(server)
      .delete('/api/article/1/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Article successfully removed from your favorite list');
        res.body.status.should.equal('success');
        done();
      });
  });

  it('should return 404 when a favorited article is not found in the list', (done) => {
    chai.request(server)
      .delete('/api/article/1/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.message.should.equal('Article not found in your favorite list');
        res.body.status.should.equal('error');
        done();
      });
  });

  it('should return 500 if an error occured', (done) => {
    chai.request(server)
      .delete('/api/article/b/favorite')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.status.should.equal('error');
        done();
      });
  });
});
