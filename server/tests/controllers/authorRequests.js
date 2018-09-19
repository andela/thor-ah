import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import TokenHelper from '../../utils/TokenHelper';

chai.use(chaiHttp);

describe('author Request', () => {
  const tokens = {};

  tokens.admin = TokenHelper.generateToken({ id: 5, username: 'Admin', role: 'admin' });
  tokens.author = TokenHelper.generateToken({ id: 2, username: 'randomAuthor2', role: 'author' });
  tokens.userOne = TokenHelper.generateToken({ id: 3, username: 'randomUser', role: 'user' });
  tokens.userTwo = TokenHelper.generateToken({ id: 4, username: 'romeo', role: 'user' });
  tokens.userThree = TokenHelper.generateToken({ id: 6, username: 'andelan', role: 'user' });

  describe('Authenticated Users', () => {
    describe('Make a request', () => {
      it('should successfully create a request', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request successful.');
            done();
          });
      });
      it('should successfully create a request', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userTwo}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request successful.');
            done();
          });
      });
      it('should return an error if the user has a pending request', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You have a pending request.');
            done();
          });
      });
      it('should return an error if the user is already an author', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.author}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You are already an author.');
            done();
          });
      });
      it('should return an error if the user is an admin', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('An admin cannot request to be an author.');
            done();
          });
      });
    });
    describe('Get requests', () => {
      it('should return all requests', (done) => {
        chai.request(app)
          .get('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.requests).to.be.an('array');
            done();
          });
      });
      it('should return a single requests', (done) => {
        chai.request(app)
          .get('/api/users/authors/requests/1')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.request).to.be.an('object');
            done();
          });
      });
    });
    describe('Delete a request', () => {
      it('should return error if request does not exist', (done) => {
        chai.request(app)
          .delete('/api/users/authors/requests/10')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You are trying to delete a request that does not exist.');
            done();
          });
      });
      it('should return error if request does not belong to user', (done) => {
        chai.request(app)
          .delete('/api/users/authors/requests/2')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You cannot delete a request that you did not make.');
            done();
          });
      });
      it('should successfully delete a request', (done) => {
        chai.request(app)
          .delete('/api/users/authors/requests/1')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userOne}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request deleted.');
            done();
          });
      });
    });
  });
  describe('Authenticated Admin', () => {
    describe('Get requests', () => {
      it('should return all request', (done) => {
        chai.request(app)
          .get('/api/admin/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.requests).to.be.an('array');
            done();
          });
      });
      it('should return all requests by a user', (done) => {
        chai.request(app)
          .get('/api/admin/authors/requests/users/4')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.requests).to.be.an('array');
            done();
          });
      });
      it('should filter requests by either pending, accepted or rejected', (done) => {
        chai.request(app)
          .get('/api/admin/authors/requests?status=pending')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.requests).to.be.an('array');
            done();
          });
      });
      it('should return a single request', (done) => {
        chai.request(app)
          .get('/api/admin/authors/requests/2')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.request).to.be.an('object');
            done();
          });
      });
    });
    describe('Respond to request', () => {
      it('should successfully create a request', (done) => {
        chai.request(app)
          .post('/api/users/authors/requests')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.userThree}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request successful.');
            done();
          });
      });
      it('should return error if request does not exist', (done) => {
        chai.request(app)
          .put('/api/admin/authors/requests/10/accept')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You are trying to respond to a request that does not exist.');
            done();
          });
      });
      it('should accept a request', (done) => {
        chai.request(app)
          .put('/api/admin/authors/requests/2/accept')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request accepted.');
            done();
          });
      });
      it('should reject a request', (done) => {
        chai.request(app)
          .put('/api/admin/authors/requests/3/reject')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send({
            feedback: 'This is the reason why you were rejected.',
          })
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request rejected.');
            done();
          });
      });
      it('should return error if feedback for rejecting a request is not provided', (done) => {
        chai.request(app)
          .put('/api/admin/authors/requests/3/reject')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send({
            feedback: '',
          })
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You must provide a feedback for rejecting a request.');
            done();
          });
      });
      it('should return error if request is accepted or rejected', (done) => {
        chai.request(app)
          .put('/api/admin/authors/requests/3/accept')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('You cannot accept a request that has been responded to.');
            done();
          });
      });
    });
    describe('Delete requests', () => {
      it('should return error if request does not exist', (done) => {
        chai.request(app)
          .delete('/api/admin/authors/requests/20')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.error.message).to.equal('The request you are trying to delete does not exist.');
            done();
          });
      });
      it('should delete a request', (done) => {
        chai.request(app)
          .delete('/api/admin/authors/requests/2')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Request deleted.');
            done();
          });
      });
    });
  });
});
