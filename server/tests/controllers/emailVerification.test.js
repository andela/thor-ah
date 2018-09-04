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
  "lastName": "adek",
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


  it('Confirms user\'s email address', (done) => {
    const token = jwt.sign({ id: user1Id }, process.env.SECRET_KEY || 'secret');
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
    const token = jwt.sign({ id: 10 }, process.env.SECRET_KEY || 'secret');
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
    const token = jwt.sign({ id: user1Id }, process.env.SECRET_KEY || 'secret');
    chai.request(app)
      .get(`/api/users/confirmation/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.status).to.equal('failed');
        expect(res.body.message).to.equal('Email has already been confirmed');
        done();
      });
  });
});
