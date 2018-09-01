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

const correctDetails = { email: 'emekag@gmail.com', password: 'emeka' };
const incorrectDetails = { email: 'emekag@gmail.com', password: 'wrongpassword' };
const emptyEmailField = { email: '', password: 'emeka' };
const emptyPasswordField = { email: 'emekag@gmail.com', password: '' };

describe('Test for users controllers', () => {
  describe('POST /api/users for users signup', () => {
    it('should successfully register a new user', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(user)
        .end((error, res) => {
          expect(res).to.have.status(201);
          res.body.userDetails.should.have.property('firstName');
          res.body.userDetails.should.have.property('lastName');
          res.body.userDetails.should.have.property('email');
          done();
        });
    });
    it('should return a bad request error message if username already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingUsername)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.username.should.equal('This username has already been registered');
          done();
        });
    });
    it('should return a bad request error message if email already exists in database', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(existingEmail)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.email.should.equal('This email has already been registered');
          done();
        });
    });
  });
  describe('POST /api/users/login for users login', () => {
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
    it('should send a bad request error message if user logs in with the wrong password', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(incorrectDetails)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.password.should.equal('Incorrect Password');
          done();
        });
    });
    it('should send a bad request error message if user logs in with empty email field', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send(emptyEmailField)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.email.should.equal('Please enter your registered email');
          done();
        });
    });
    it('should send a bad request error message if user logs in with empty password field', (done) => {
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
