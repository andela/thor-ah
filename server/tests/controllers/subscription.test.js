import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../../index';
import TokenHelper from '../../utils/TokenHelper';

chai.use(chaiHttp);

const token1 = `Bearer ${TokenHelper.generateToken({ id: 4, username: 'romeo' })}`;
const adminToken = `Bearer ${TokenHelper.generateToken({ id: 8, username: 'awesomeAuthor' })}`;
const token2 = `Bearer ${TokenHelper.generateToken({ id: 7, username: 'juliet' })}`;

describe('Subscription Controller', () => {
  describe('viewUserSubscription', () => {
    it('should get subscription details of users for the admin', (done) => {
      request(app)
        .get('/api/subscription/user-subscription/')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('should return error if user is not an admin', (done) => {
      request(app)
        .get('/api/subscription/user-subscription/')
        .set('Authorization', token1)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(401);
          expect(status).to.equal('error');
          expect(error.message).to.equal('user not an admin');
          done();
        });
    });
    it('should get subscription details of a single user for the admin', (done) => {
      request(app)
        .get('/api/subscription/user-subscription/4')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('should return error if user has made no subscription yet', (done) => {
      request(app)
        .get('/api/subscription/user-subscription/8')
        .set('Authorization', adminToken)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(status).to.equal('error');
          expect(error.message).to.equal('user does not have a subscription yet');
          done();
        });
    });
    it('should return error if user is not an admin', (done) => {
      request(app)
        .get('/api/subscription/user-subscription/4')
        .set('Authorization', token1)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(401);
          expect(status).to.equal('error');
          expect(error.message).to.equal('user not an admin');
          done();
        });
    });
  });
  describe('viewArticle', () => {
    it('should return error if user tries to get more than 5 articles without subscription', (done) => {
      request(app)
        .get('/api/articles/evbenjkve')
        .set('Authorization', token2)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });
});
