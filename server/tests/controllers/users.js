import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import app from '../../../index';

chai.use(chaiHttp);
env.config();

describe('Test for users controllers', () => {
  const email = 'iamuchejude@gmail.com';
  const token = jwt.sign({ user: { email }, links: { reset: 'http://localhost:5000' } }, process.env.JWT_SECRET_TOKEN, { expiresIn: '2h' });
  const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhbXVjaGVqdWRlQGdtYWlsLmNvbSIsImlhdCI6MTUzNTczMTgyNSwiZXhwIjoxNTM1NzM5MDI1fQ.BBwKljkzNFTKVuCE4VRHTv8GF4Q6uuA6_KZ8MMLdvR4';
  describe('/POST /api/users/password/recover', () => {
    it('should return success{} because send mail with password reset link', (done) => {
      chai
        .request(app)
        .post('/api/users/password/recover')
        .send({ user: { email }, links: { reset: 'http://localhost:5000' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.an('object');
          expect(res.body.success.message).to.equal('We have sent you a verification link. Please check your email to continue.');
          done();
        });
    });
  });

  describe('/POST /api/users/password/recover', () => {
    it('should return errors{} because email is not registered', (done) => {
      chai
        .request(app)
        .post('/api/users/password/recover')
        .send({ user: { email: 'tester@testing.com' }, links: { reset: 'http://localhost:5000' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.message).to.equal('User with this email does exist.');
          done();
        });
    });
  });

  describe('/api/users/password/reset/:token', () => {
    it('should return success{} and change user password', (done) => {
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

  describe('/POST /api/users/password/reset/:token', () => {
    it('should return errors{} as password(minlength is 6) is too short', (done) => {
      chai
        .request(app)
        .post(`/api/users/password/reset/${token}`)
        .send({ user: { password: 'newPa' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.message).to.equal('Password is too short. Password should contain at least 6 characters.');
          done();
        });
    });
  });

  describe('/POST /api/users/password/reset/:token', () => {
    it('should return errors{} because reset token is no valid', (done) => {
      chai
        .request(app)
        .post(`/api/users/password/reset/${wrongToken}`)
        .send({ user: { password: 'newPassword' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.message).to.equal('Reset link is expired or invalid. Please try again.');
          done();
        });
    });
  });

  describe('/POST /api/users/password/reset/:token', () => {
    it('should return errors{} because password is not provided', (done) => {
      chai
        .request(app)
        .post(`/api/users/password/reset/${token}`)
        .send({ user: { } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.message).to.equal('Please provide your password.');
          done();
        });
    });
  });

  describe('/POST /api/users/password/reset/:token', () => {
    it('should return errors{} becuase password is not null', (done) => {
      chai
        .request(app)
        .post(`/api/users/password/reset/${token}`)
        .send({ user: { password: '' } })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.message).to.equal('Please provide your password.');
          done();
        });
    });
  });
});
