import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
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
  password: 'sdfghgfdkjshfbjbsfjb'
};
const correctDetails = { email: 'emekag@gmail.com', password: 'emeka' };
const incorrectDetails = { email: 'emekag@gmail.com', password: 'wrongpassword' };
const emptyEmailField = { email: '', password: 'emeka' };
const emptyPasswordField = { email: 'emekag@gmail.com', password: '' };

describe('Users Controllers', () => {
  describe('userSignup()', () => {
    it('should successfully register a new user', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(user)
        .end((error, res) => {
          const { userDetails } = res.body;
          expect(res).to.have.status(201);
          userDetails.should.have.property('firstName');
          userDetails.should.have.property('lastName');
          userDetails.should.have.property('email');
          done();
        });
    });
    it('should return error if username already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingUsername)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.username.should.equal('This username has already been registered');
          done();
        });
    });
    it('should return error if email already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingEmail)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.email.should.equal('This email has already been registered');
          done();
        });
    });
    it('should return error if email is invalid', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(invalidEmail)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.email.should.equal('Please enter a valid email');
          done();
        });
    });
    it('should return error if password exceeds 8 characters', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(invalidPassword)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.password.should.equal('Password should not exceed 8 characters');
          done();
        });
    });
  });
  describe('userLogin()', () => {
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
    it('should send error if user logs in with the wrong password', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(incorrectDetails)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.password.should.equal('Incorrect Password');
          done();
        });
    });
    it('should send error if user logs in with empty email field', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(emptyEmailField)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.email.should.equal('Please enter your registered email');
          done();
        });
    });
    it('should send error if user logs in with empty password field', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(emptyPasswordField)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.password.should.equal('Please enter your password');
          done();
        });
    });
  });
});
