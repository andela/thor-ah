import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../../..';

chai.use(chaiHttp);

// This is a test to show that the external services was called
describe('Signs up user with their Google account', () => {
  before(() => {
    nock('https://accounts.google.com')
      .filteringPath(() => '/')
      .get('/')
      .reply(200, {
        message: 'You are logged in',
        user: {
          id: 10,
          role: 'user',
          firstName: 'Mo\'rin',
          lastName: 'd\'okla',
          username: 'corn',
          email: 'job.adelia.com',
          image: 'image.png',
          token: 'token'
        },
        status: 'success'
      });

    nock('https://www.facebook.com')
      .filteringPath(() => '/')
      .get('/')
      .reply(200, {
        message: 'You are logged in',
        user: {
          id: 10,
          role: 'user',
          firstName: 'Mo\'rin',
          lastName: 'd\'okla',
          username: 'corn',
          email: 'job.adelia.com',
          image: 'image.png',
          token: 'token'
        },
        status: 'success'
      });
  });

  it('Authenticates with google', (done) => {
    chai.request(app)
      .get('/api/auth/google')
      .end((err, res) => {
        expect(res.body.message).to.be.equal('You are logged in');
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('Authenticates with facebook', (done) => {
    chai.request(app)
      .get('/api/auth/facebook')
      .end((err, res) => {
        expect(res.body.message).to.be.equal('You are logged in');
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });
});
