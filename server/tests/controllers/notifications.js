/* eslint-disable no-unused-expressions */
import chai, { request } from 'chai';
import chaiHttp from 'chai-http';
import log from 'fancy-log';

import app from '../../../index';
import TokenHelper from '../../utils/TokenHelper';
import { Notification } from '../../models';

chai.should();
chai.use(chaiHttp);

const token = `Bearer ${TokenHelper.generateToken({ id: 7, username: 'somename1' })}`;

describe('Notification Controller', () => {
  // drop(if exists) and create user table
  before((done) => {
    Notification.sync({ force: true, logging: false })
      .then(() => {
        done();
      });
  });

  before((done) => {
    Notification.create({
      userId: 7,
      articleSlug: 'some-test-slug0923',
      message: 'test notification message'
    })
      .then(() => done())
      .catch(e => log(e));
  });

  describe('get notifications', () => {
    it('should return list of user\'s notifications', (done) => {
      request(app)
        .get('/api/users/notifications')
        .set('Authorization', token)
        .end((err, res) => {
          res.type.should.equal('application/json');
          res.should.have.status(200);
          res.body.status.should.equal('success');
          res.body.notifications.should.be.an('Array');
          done();
        });
    });
  });


  describe('delete notifications', () => {
    it('should delete given notification', (done) => {
      request(app)
        .delete('/api/users/notifications/1')
        .set('Authorization', token)
        .end((err, res) => {
          res.type.should.equal('application/json');
          res.should.have.status(200);
          res.body.status.should.equal('success');
          done();
        });
    });

    it('should return return error if notifications does not exist', (done) => {
      request(app)
        .delete('/api/users/notifications/9')
        .set('Authorization', token)
        .end((err, res) => {
          res.type.should.equal('application/json');
          res.should.have.status(404);
          res.body.status.should.equal('error');
          done();
        });
    });
  });
});
