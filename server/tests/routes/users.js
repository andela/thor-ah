import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import app from '../../../index';

chai.use(chaiHttp);
env.config();

describe('Test for users route', () => {
  const email = 'iamuchejude@gmail.com';
  const token = jwt.sign({ user: { email }, links: { reset: 'http://localhost:5000' } }, process.env.JWT_SECRET_TOKEN, { expiresIn: '2h' });
  describe('/POST /api/users/password/recover', () => {
    it('should return a success{} with status code of 200', (done) => {
      chai
        .request(app)
        .post('/api/users/password/recover')
        .send({ user: { email }, links: { reset: 'http://localhost:5000' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.an('object');
          done();
        });
    });
  });
  describe('/POST /api/users/password/reset/:token', () => {
    it('should return a success{} with status code of 200', (done) => {
      chai
        .request(app)
        .post(`/api/users/password/reset/${token}`)
        .send({ user: { password: 'newPassword' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.an('object');
          done();
        });
    });
  });

  describe('/POST /api/users/password/reset', () => {
    it('should return an errors{} with status code of 404', (done) => {
      chai
        .request(app)
        .post('/api/users/password/reset')
        .send({ user: { password: 'newPassword' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          done();
        });
    });
  });
});
