import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../../..';

dotenv.config();

chai.use(chaiHttp);

const newUser = {
  firstName: 'daniel',
  lastName: 'adek',
  username: 'danieladek',
  email: 'danieladek@gmail.com',
  password: 'adek'
};

const newUser2 = {
  firstName: 'ayo',
  lastName: 'david',
  username: 'ayodavid',
  email: 'ayodavid@gmail.com',
  password: 'ayodavid'
};

let user1Email;

describe('Verify User\'s email address after signup', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users')
      .send(newUser)
      .end((err, res) => {
        user1Email = res.body.user.email;
        done();
      });
  });

  it('Registers a new user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send(newUser2)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Signup was successful. Please check your email to verify your account');
        done();
      });
  });


  it('Confirms user\'s email address', (done) => {
    const token = jwt.sign({ email: user1Email }, process.env.JWT_KEY || 'secret');
    chai.request(app)
      .get(`/api/users/confirmation/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Email confirmed successfully. You can now login');
        done();
      });
  });

  it('Returns an error if user does not exitst in the database', (done) => {
    const token = jwt.sign({ id: 10 }, process.env.JWT_KEY || 'secret');
    chai.request(app)
      .get(`/api/users/confirmation/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal('failed');
        expect(res.body.message).to.equal('User does not exist in the database');
        done();
      });
  });

  it('Returns an error if user has been verified', (done) => {
    const token = jwt.sign({ email: user1Email }, process.env.JWT_KEY || 'secret');
    chai.request(app)
      .get(`/api/users/confirmation/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.status).to.equal('failed');
        expect(res.body.message).to.equal('Email has already been confirmed');
        done();
      });
  });

  describe('Resend verification email to user', () => {
    it('Resends verification email if requested by the user', (done) => {
      chai.request(app)
        .post('/api/users/verify/resend-email')
        .send({ email: 'ayodavid@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Verification email has been resent');
          done();
        });
    });

    it('Returns and error if user has already', (done) => {
      chai.request(app)
        .post('/api/users/verify/resend-email')
        .send({ email: 'danieladek@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.equal('failed');
          expect(res.body.message).to.equal('Your account had already been verified');
          done();
        });
    });
  });
});
