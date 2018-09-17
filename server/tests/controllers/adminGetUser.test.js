import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

const userLogin = {
  email: 'su@mail.com',
  password: process.env.USER_PASSWORD
};

const adminLogin = {
  email: 'sa@mail.com',
  password: process.env.ADMIN_PASSWORD
};

let { token1, token2 } = '';

describe('Admin get Users and Authors function', () => {
  // get token for accessing the route
  it('generates a token that cannot access the route', (done) => {
    chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(userLogin)
      .end((err, res) => {
        token1 = res.body.user.token;
        done();
      });
  });

  // get token for accessing the route
  it('generates a token for accessing the route', (done) => {
    chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(adminLogin)
      .end((err, res) => {
        token2 = res.body.user.token;
        done();
      });
  });

  it('should return 401 if user is not an admin', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers')
      .set('Authorization', `Bearer ${token1}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.error.message.should.equal('you are not an Admin');
        res.body.status.should.equal('error');
        done();
      });
  });

  it('should return 200 if all users are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('All registered users returned');
        res.body.status.should.equal('success');
        done();
      });
  });

  it('should return 200 if all authors are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getAuthors')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('All registered authors returned');
        res.body.status.should.equal('success');
        done();
      });
  });
});
