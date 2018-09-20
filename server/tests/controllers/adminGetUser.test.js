import chai from 'chai';
import env from 'dotenv';
import chaiHttp from 'chai-http';
import server from '../../..';

env.config();

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
        const { error, status } = res.body;
        res.should.have.status(401);
        error.message.should.equal('You are not an Admin');
        status.should.equal('error');
        done();
      });
  });

  it('should return 200 if all users are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        const { message, status } = res.body;
        res.should.have.status(200);
        message.should.equal('All registered users returned');
        status.should.equal('success');
        done();
      });
  });

  it('should return 200 if all authors are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers?role=author')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        const { message, status } = res.body;
        res.should.have.status(200);
        message.should.equal('All registered author returned');
        status.should.equal('success');
        done();
      });
  });

  it('should return 200 if all users are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers?role=user')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        const { message, status } = res.body;
        res.should.have.status(200);
        message.should.equal('All registered user returned');
        status.should.equal('success');
        done();
      });
  });

  it('should return 200 if all admins are returned', (done) => {
    chai.request(server)
      .get('/api/admin/getUsers?role=admin')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        const { message, status } = res.body;
        res.should.have.status(200);
        message.should.equal('All registered admin returned');
        status.should.equal('success');
        done();
      });
  });
});
