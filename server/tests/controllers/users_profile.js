import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../../..';

chai.use(chaiHttp);
env.config();
chai.should();

const updateContent = {
  username: 'thor',
  firstName: 'Samuel',
  linkedin: 'www.linkedin.com',
  bio: 'A very good and prolific Author'
};

const incorrectUrlInput = { linkedin: 'wrongUrlformat' };
const incorrectUsernameInput = { username: 'b' };
const existingUsernameInput = { username: 'thor' };
const incorrectNameInput = {
  firstName: 'Emekauuiijjnnnnnghhhhhhnnngffgghhh',
  lastName: 'Emekauuiijjnnnnnghhhhhhnnngffgghhh'
};

describe('Test for users profiles', () => {
  describe('GET /api/users', () => {
    it('should return all users profile', (done) => {
      chai.request(app)
        .get('/api/users')
        .end((error, res) => {
          expect(res).to.have.status(200);
          res.body.profiles[0].should.have.property('firstName');
          res.body.profiles[0].should.have.property('image');
          res.body.profiles[0].should.have.property('email');
          done();
        });
    });
  });

  describe('GET /api/profiles/:username', () => {
    it('should return response for a single user', (done) => {
      chai.request(app)
        .get('/api/users/andelan')
        .end((error, res) => {
          expect(res).to.have.status(200);
          res.body.profile.should.have.property('lastName');
          res.body.profile.should.have.property('image');
          res.body.profile.should.have.property('email');
          done();
        });
    });
    it('should return a 404 error for username that does not exist', (done) => {
      chai.request(app)
        .get('/api/users/wrongparam')
        .end((error, res) => {
          expect(res).to.have.status(404);
          res.body.errors.message.should.eql('User not found');
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('PUT /api/profiles/:userId', () => {
    it('should return a 404 error message for user that does not exist', (done) => {
      chai.request(app)
        .put('/api/users/10')
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(404);
          res.body.errors.message.should.eql('User not found');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return a bad request error message for invalid ID', (done) => {
      chai.request(app)
        .put('/api/users/adgb')
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.message.should.eql('Your request ID is invalid');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should successfully update user profile with the correct input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          res.body.updatedUser.should.have.property('lastName');
          res.body.updatedUser.should.have.property('image');
          done();
        });
    });
    it('should return a bad request error message for a wrong url input in social media links', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(incorrectUrlInput)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.linkedin.should.eql('linkedin URL is not valid');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return a bad request error message for short username input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(incorrectUsernameInput)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.username.should.eql('Username should to be between 2 and 15 characters');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return a bad request error message for already existing username input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(existingUsernameInput)
        .end((error, res) => {
          expect(res).to.have.status(409);
          res.body.errors.username.should.eql('Username already exists');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return a bad request error message for name input longer than required', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(incorrectNameInput)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.errors.firstName.should.eql('First name should not be more than 20 characters');
          res.body.errors.lastName.should.eql('Last name should not be more than 20 characters');
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
