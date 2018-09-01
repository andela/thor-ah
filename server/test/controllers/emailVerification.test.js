import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

describe.only('Verify User\'s email address', () => {
  it('Sends verification email to user after signup', (done) => {
    chai.request(app)
    .get('/verify-email/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Email verification has been sent successfully')
        done();
      });
  });

  it('Confirms user\'s email address', (done) => {
    chai.request(app)
    .get('/confirmation/:token')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success')
      expect(res.body.message).to.equal('Email confirmed successfully. You can now login')
      done();
    })
  })
});