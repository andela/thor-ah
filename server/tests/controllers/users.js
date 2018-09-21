import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
import app from '../../..';

chai.use(chaiHttp);
env.config();
chai.should();

const user = {
  username: 'andelan',
  firstName: 'Emeka',
  lastName: 'Chinedu',
  email: 'emekag@gmail.com',
  password: 'emeka'
};

const existingUsername = {
  username: 'andelan',
  firstName: 'Emeka',
  lastName: 'Chinedu',
  email: 'emekbros@gmail.com',
  password: 'emeka'
};

const existingEmail = {
  username: 'andelani',
  firstName: 'Emeka',
  lastName: 'Chinedu',
  email: 'emekag@gmail.com',
  password: 'emeka'
};

const invalidEmail = {
  username: 'andelane',
  firstName: 'Emeka',
  lastName: 'Chinedu',
  email: 'emekagcom',
  password: 'emeka'
};
const invalidPassword = {
  username: 'andelae',
  firstName: 'Emeka',
  lastName: 'Chinedu',
  email: 'emeka1@gmail.com',
  password: 'sdfghgfdkjshfbjbsfjbdmnbdkjfgeugfuefguefge'
};
const wrongEmail = { email: 'xyz@mail.com', password: 'passtes' };

const correctDetails = { email: 'emekag@gmail.com', password: 'emeka' };
const incorrectDetails = { email: 'emekag@gmail.com', password: 'wrongpassword' };
const emptyEmailField = { email: '', password: 'emeka' };
const emptyPasswordField = { email: 'emekag@gmail.com', password: '' };
const token = jwt.sign({ user: { email: user.email }, links: { reset: 'https://thor-ah.com' } }, process.env.JWT_KEY, { expiresIn: '2h' });
const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhbXVjaGVqdWRlQGdtYWlsLmNvbSIsImlhdCI6MTUzNTczMTgyNSwiZXhwIjoxNTM1NzM5MDI1fQ.BBwKljkzNFTKVuCE4VRHTv8GF4Q6uuA6_KZ8MMLdvR4';

describe('Users Controllers', () => {
  describe('userSignup', () => {
    it('should successfully register a new user', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(user)
        .end((error, res) => {
          expect(res).to.have.status(201);
          res.body.should.have.property('user');
          done();
        });
    });
    it('should return error if username already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingUsername)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.username.should.equal('This username has already been registered');
          done();
        });
    });
    it('should return error if email already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingEmail)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.email.should.equal('This email has already been registered');
          done();
        });
    });
    it('should return error if email is invalid', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(invalidEmail)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.email.should.equal('Please enter a valid email');
          done();
        });
    });
    it('should return error if password exceeds 20 characters', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(invalidPassword)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.password.should.equal('Password should not exceed 20 characters');
          done();
        });
    });
  });
  describe('userLogin', () => {
    it('should successfully login a registered user', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(correctDetails)
        .end((error, res) => {
          expect(res).to.have.status(200);
          res.body.message.should.equal('Login successful');
          done();
        });
    });
    it('should send error if user supplies the wrong email', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(wrongEmail)
        .end((error, res) => {
          expect(res).to.have.status(404);
          res.body.error.email.should.equal('User not found');
          done();
        });
    });
    it('should send error if user logs in with the wrong password', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(incorrectDetails)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.password.should.equal('Incorrect Password');
          done();
        });
    });
    it('should send error if user logs in with empty email field', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(emptyEmailField)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.email.should.equal('Please enter your registered email');
          done();
        });
    });
    it('should send error if user logs in with empty password field', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(emptyPasswordField)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.password.should.equal('Please enter your password');
          done();
        });
    });
  });
  describe('recover password', () => {
    it('should take a payload and send a mail to the email provided', (done) => {
      chai.request(app)
        .post('/api/users/password/recover')
        .send({
          email: user.email,
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('success');
          res.body.message.should.equal('Please follow the instructions in the email that has been sent to your address.');
          done();
        });
    });
    it('should return error if email is not provided', (done) => {
      chai.request(app)
        .post('/api/users/password/recover')
        .send({
          email: '',
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Please provide a valid email.');
          done();
        });
    });
    it('should return error if email is not registered', (done) => {
      chai.request(app)
        .post('/api/users/password/recover')
        .send({
          email: 'emailnot@registered.com',
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('The email you provided is not registered.');
          done();
        });
    });
  });
  describe('reset password', () => {
    it('should reset user\'s password if valid token and password are provided', (done) => {
      chai.request(app)
        .post('/api/users/password/reset')
        .send({
          tokens: {
            reset: token
          },
          user: {
            password: 'newPassword',
          },
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('success');
          res.body.message.should.equal('Password changed successfully.');
          done();
        });
    });
    it('should return error if reset token is not provided', (done) => {
      chai.request(app)
        .post('/api/users/password/reset')
        .send({
          tokens: {
            reset: '',
          },
          user: {
            password: 'newPassword',
          },
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Please provide a reset token.');
          done();
        });
    });
    it('should return error if reset token is expired or invalid', (done) => {
      chai.request(app)
        .post('/api/users/password/reset')
        .send({
          tokens: {
            reset: wrongToken,
          },
          user: {
            password: 'newPassword',
          }
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Reset link is expired. Please restart the recovery process.');
          done();
        });
    });
    it('should return error if new password is not provided', (done) => {
      chai.request(app)
        .post('/api/users/password/reset')
        .send({
          tokens: {
            reset: token,
          },
          user: {
            password: '',
          },
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Please provide a new password.');
          done();
        });
    });
    it('should return error if password is less than 6 characters', (done) => {
      chai.request(app)
        .post('/api/users/password/reset')
        .send({
          tokens: {
            reset: token,
          },
          user: {
            password: 'pass',
          },
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.status.should.equal('error');
          res.body.message.should.equal('Password should be at least 6 characters.');
          done();
        });
    });
  });
});
