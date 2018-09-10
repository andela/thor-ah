import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

describe('authorController', () => {
  const tokens = {};
  const accounts = {
    admin: {
      email: 'admin@mail.com',
      password: process.env.ADMIN_PASSWORD,
    },
    user: {
      email: 'su@mail.com',
      password: process.env.USER_PASSWORD,
    },
    author: {
      email: 'sa@mail.com',
      password: process.env.AUTHOR_PASSWORD,
    },
  };
  before(() => {
    it('should log the admin in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(accounts.admin)
        .end((err, res) => {
          tokens.admin = res.body.user.token;
          done();
        });
    });
    it('should log the user in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(accounts.user)
        .end((err, res) => {
          tokens.user = res.body.user.token;
          done();
        });
    });
    it('should log the author in', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Accept', 'application/json')
        .send(accounts.author)
        .end((err, res) => {
          tokens.author = res.body.user.token;
          done();
        });
    });
  });

  describe('authorController', () => {
    it('should successfully create a request', (done) => {
      chai.request(app)
        .post('/api/users/authors/requests')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.user}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('You have successfully requested to be an author.');
          done();
        });
    });
    it('should return an error if the user has a pending request', (done) => {
      chai.request(app)
        .post('/api/users/authors/requests')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.author}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('You already have a pending request.');
          done();
        });
    });
    it('should return an error if the user is already an author', (done) => {
      chai.request(app)
        .post('/api/users/authors/requests')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.author}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('error');
          expect(res.body.error.message).to.equal('You are already an author.');
          done();
        });
    });
    it('should return all requests of an authenticated user', (done) => {
      chai.request(app)
        .get('/api/users/authors/requests')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.author}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.requests).to.be.an('array');
          done();
        });
    });
    it('should return a single requests of an authenticated user', (done) => {
      chai.request(app)
        .get('/api/users/authors/requests/10')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.author}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.requests).to.be.an('object');
          done();
        });
    });
    it('should cancel a request', (done) => {
      chai.request(app)
        .get('/api/users/authors/requests/10/cancel')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.user}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Request cancelled.');
          done();
        });
    });
    it('should return all request', (done) => {
      chai.request(app)
        .get('/api/admin/authors/requests/10')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.requests).to.be.an('array');
          done();
        });
    });
    it('should return a single request', (done) => {
      chai.request(app)
        .get('/api/admin/authors/requests/10')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.request).to.be.an('object');
          done();
        });
    });
    it('should accept a request', (done) => {
      chai.request(app)
        .get('/api/admin/authors/requests/10/accept')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Request accepted.');
          done();
        });
    });
    it('should reject a request', (done) => {
      chai.request(app)
        .get('/api/admin/authors/requests/10/reject')
        .set('Accept', 'application/json')
        .send('Authorization', `Bearer ${tokens.admin}`)
        .send({
          note: 'This is the reason why you were rejected.',
        })
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Request rejected.');
          done();
        });
    });
  });
});
