import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../..';
import TokenHelper from '../../utils/TokenHelper';

require('dotenv').config();

chai.use(chaiHttp);

describe('adminDeactivate controller', () => {
  const token = `Bearer ${TokenHelper.generateToken({ id: 4, role: 'admin', username: 'awesomeAuthor' })}`;
  describe('deleteAuthor', () => {
    it('should be able to delete an author and assign articles to another author', (done) => {
      chai.request(app)
        .delete('/api/users/delete/4')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('should return 404 error if user does not exist', (done) => {
      chai.request(app)
        .delete('/api/users/delete/23333')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });
  describe('deactivateUser', () => {
    it('should be able to deactivate a user account', (done) => {
      chai.request(app)
        .put('/api/admin/deactivate/1')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('should return 404 error if user does not exist', (done) => {
      chai.request(app)
        .put('/api/admin/deactivate/123473')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });

  describe('activateUser', () => {
    it('should be able to reactivate a user account', (done) => {
      chai.request(app)
        .put('/api/admin/activate/1')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('should return 404 error if user does not exist', (done) => {
      chai.request(app)
        .put('/api/admin/activate/222222')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });
});
