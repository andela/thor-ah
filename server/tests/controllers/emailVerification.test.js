import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../../..';
import { User } from '../../models/User';

dotenv.config();

chai.use(chaiHttp);

const newUser = {
  "firstName": "daniel",
  "lastName": "daniel",
  "username": "danieladek",
  "email": "danieladek@gmail.com",
  "password": "danieldev"
};

let user1Id;

describe.only('Verify User\'s email address after signup', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users')
      .send(newUser)
      .end((err, res) => {
        user1Id = res.body.userDetails.id;
        done();
      });
  });

  // it('Sends verification email to user after signup', (done) => {
  //   chai.request(app)
  //     .post('/api/users')
  //     .send(newUser)
  //     .end((err, res) => {
  //       expect(res).to.have.status(201);
  //       expect(res.body.status).to.equal('success');
  //       expect(res.body.message).to.equal('Signup was successful. Please check your email to verify your account');
  //       done();
  //     });
  // });

  it('Confirms user\'s email address', (done) => {
    const token = jwt.sign(user1Id, process.env.SECRET_KEY || 'secret');
    chai.request(app)
      .put(`api/users/confirmation/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Email confirmed successfully. You can now login');
        done();
      });
  });
});
