import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../../..';
import TokenHelper from '../../utils/TokenHelper';

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

// generate token and use for subsequent access
const token = `Bearer ${TokenHelper.generateToken({ id: 1 })}`;

describe('Users Controllers', () => {
  describe('getUserProfileByUsername', () => {
    it('should return response for a single user', (done) => {
      chai.request(app)
        .get('/api/users/andelan')
        .set('Authorization', token)
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
        .set('Authorization', token)
        .end((error, res) => {
          expect(res).to.have.status(404);
          res.body.error.message.should.eql('User not found');
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('updateUserProfile', () => {
    it('an admin can update any users profile', (done) => {
      const adminToken = `Bearer ${TokenHelper.generateToken({ id: 10, role: 'admin' })}`;
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', adminToken)
        .send({
          firstName: 'Samuel',
          linkedin: 'www.linkedin.com',
          bio: 'A very good and prolific Author'
        })
        .end((error, res) => {
          const { user } = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          user.should.have.property('lastName');
          user.should.have.property('image');
          done();
        });
    });
    it('an admin can update a user role', (done) => {
      const adminToken = `Bearer ${TokenHelper.generateToken({ id: 10, role: 'admin' })}`;
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', adminToken)
        .send({
          role: 'author'
        })
        .end((error, res) => {
          const { user } = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          user.should.have.property('lastName');
          user.should.have.property('image');
          user.role.should.equal('author');
          done();
        });
    });
    it('only a super admin can assign "admin" role', (done) => {
      const adminToken = `Bearer ${TokenHelper.generateToken({ id: 10, role: 'admin' })}`;
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', adminToken)
        .send({
          firstName: 'Samuel',
          linkedin: 'www.linkedin.com',
          bio: 'A very good and prolific Author',
          role: 'admin'
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error.message).to.equal('only Super Admin can update role to admin');
          done();
        });
    });
    it('should return an error if wrong role is supplied', (done) => {
      const superAdminToken = `Bearer ${TokenHelper.generateToken({ id: 1, role: 'superAdmin' })}`;
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', superAdminToken)
        .send({
          role: 'non existing role'
        })
        .end((error, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error.role).to.equal('role type is not valid');
          done();
        });
    });
    it('should prevent user from updating other users profiles', (done) => {
      const unauthorizedUserToken = `Bearer ${TokenHelper.generateToken({ id: 10 })}`;
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', unauthorizedUserToken)
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('should return error for user that does not exist', (done) => {
      const unexistingUserToken = `Bearer ${TokenHelper.generateToken({ id: 10 })}`;
      chai.request(app)
        .put('/api/users/10')
        .set('Authorization', unexistingUserToken)
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(404);
          res.body.error.message.should.eql('User not found');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return error for invalid ID', (done) => {
      chai.request(app)
        .put('/api/users/adgb')
        .set('Authorization', token)
        .send(updateContent)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.message.should.eql('Your request ID is invalid');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should successfully update user profile with the correct input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', token)
        .send(updateContent)
        .end((error, res) => {
          const { user } = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          user.should.have.property('lastName');
          user.should.have.property('image');
          done();
        });
    });
    it('should return error for a wrong url input in social media links', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', token)
        .send(incorrectUrlInput)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.linkedin.should.eql('linkedin URL is not valid');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return error for short username input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', token)
        .send(incorrectUsernameInput)
        .end((error, res) => {
          expect(res).to.have.status(400);
          res.body.error.username.should.eql('Username should to be between 2 and 15 characters');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return error for already existing username input', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', token)
        .send(existingUsernameInput)
        .end((error, res) => {
          expect(res).to.have.status(409);
          res.body.error.username.should.eql('Username already exists');
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return error for name input longer than required', (done) => {
      chai.request(app)
        .put('/api/users/1')
        .set('Authorization', token)
        .send(incorrectNameInput)
        .end((error, res) => {
          const { firstName, lastName } = res.body.error;
          expect(res).to.have.status(400);
          firstName.should.eql('First name should not be more than 20 characters');
          lastName.should.eql('Last name should not be more than 20 characters');
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
