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

describe('Users Controllers', () => {
  describe('getUsersProfiles()', () => {
    it('should return all users profile', (done) => {
      chai.request(app)
        .get('/api/users')
        .end((error, res) => {
          const { profiles } = res.body;
          expect(res).to.have.status(200);
          profiles[0].should.have.property('firstName');
          profiles[0].should.have.property('image');
          profiles[0].should.have.property('email');
          done();
        });
    });
  });

  describe('getUserProfileByUsername()', () => {
    it('should return response for a single user', (done) => {
      chai.request(app)
        .get('/api/users/andelan')
        .end((error, res) => {
          const { profile } = res.body;
          expect(res).to.have.status(200);
          profile.should.have.property('lastName');
          profile.should.have.property('image');
          profile.should.have.property('email');
          done();
        });
    });
    it('should return error for username that does not exist', (done) => {
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

  describe('updateUserProfile()', () => {
    it('should return error for user that does not exist', (done) => {
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
    it('should return error for invalid ID', (done) => {
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
          const { dataValues } = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          dataValues.should.have.property('lastName');
          dataValues.should.have.property('image');
          done();
        });
    });
    it('should return error for a wrong url input in social media links', (done) => {
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
    it('should return error for short username input', (done) => {
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
    it('should return error for already existing username input', (done) => {
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
    it('should return error for name input longer than required', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .send(incorrectNameInput)
        .end((error, res) => {
          const { firstName, lastName } = res.body.errors;
          expect(res).to.have.status(400);
          firstName.should.eql('First name should not be more than 20 characters');
          lastName.should.eql('Last name should not be more than 20 characters');
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
