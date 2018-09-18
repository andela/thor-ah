/* eslint-disable no-unused-expressions */
import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../../index';
import TokenHelper from '../../utils/TokenHelper';

chai.use(chaiHttp);

describe('adminHandleRoles', () => {
  const token = `Bearer ${TokenHelper.generateToken({ id: 1, role: 'superAdmin', username: 'superadmin' })}`;
  describe('assignAdminRole', () => {
    it('should make a user an admin', (done) => {
      request(app)
        .put('/api/admin/users/4/roles')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.user.role).to.equal('admin');
          done();
        });
    });

    it('should return a 404 if user does not exist', (done) => {
      request(app)
        .put('/api/admin/users/40398/roles')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('revokeAdminRole', () => {
    it('should revoke an admin role back to "user"', (done) => {
      request(app)
        .delete('/api/admin/users/4/roles')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.user.role).to.equal('user');
          done();
        });
    });

    it('should return a 404 if user does not exist', (done) => {
      request(app)
        .delete('/api/admin/users/40398/roles')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
});
