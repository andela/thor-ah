import { expect } from 'chai';
import { spy } from 'sinon';

import auth from '../../middleware/auth';
import TokenHelper from '../../utils/TokenHelper';

const {
  authenticateUser,
  authorizeAdmin,
  authorizeAuthor,
  authorizeSuperAdmin
} = auth;

describe('auth middleware', () => {
  it('should exist', () => {
    expect(auth).to.exist; // eslint-disable-line no-unused-expressions
  });

  it('should have a static method: authenticateUser', () => {
    expect(authenticateUser).to.be.a(
      'function'
    );
  });

  describe('authenticateUser', () => {
    const req = {
      headers: {}
    };
    const res = {};

    it('should always call next()', () => {
      const nextSpy = spy();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
    });

    it('should call next() with an error if no token is provided in authorization header', () => {
      req.headers = {};
      const nextSpy = spy();
      authenticateUser(req, res, nextSpy);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message).to.equal('no token provided');
    });

    it('should call next() with an error if token not supplied as Bearer', () => {
      req.headers = {
        authorization: 'NotBearer some.token'
      };
      const nextSpy = spy();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message).to.equal('Invalid authorization format');
    });

    it('should call next() with a jwt error if malformed/invalid token provided', () => {
      req.headers = {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM1NzkyNDUxLCJleHAiOjE1MzU4MDY4NTF9.YRbv4jmOgacT2gA4glNZwKBYybaMODbObtkN6-z_1hQ'
      };
      const nextSpy = spy();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message.split(' ')[0]).to.equal('JsonWebTokenError:');
    });

    it('should set the id of the user in the current session to the req body', (done) => {
      const token = TokenHelper.generateToken({ id: 1, username: 'johndoe' });
      req.headers = {
        authorization: `Bearer ${token}`
      };
      const nextSpy = spy();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
      expect(req.userId).to.equal(1);
      done();
    });
  });

  describe('authorizeAuthor', () => {
    const req = {
      headers: {}
    };
    const res = {};

    it('should always call next()', () => {
      const nextSpy = spy();
      authorizeAuthor(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
    });

    it('should call next with an error if user is not an author', () => {
      req.userRole = 'user';
      const nextSpy = spy();
      authorizeAuthor(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message).to.equal('You are not an Author');
    });

    it('should call next middleware if user is author', () => {
      req.userRole = 'author';
      const nextSpy = spy();
      authorizeAuthor(req, res, nextSpy);
      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0]).to.equal(undefined);
    });
  });

  describe('authorizeAdmin', () => {
    const req = {
      headers: {}
    };
    const res = {};

    it('should always call next()', () => {
      const nextSpy = spy();
      authorizeAdmin(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
    });

    it('should call next with an error if user is not an admin', () => {
      req.userRole = 'user';
      const nextSpy = spy();
      authorizeAdmin(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message).to.equal('You are not an Admin');
    });

    it('should call next middleware if user is admin', () => {
      req.userRole = 'admin';
      const nextSpy = spy();
      authorizeAdmin(req, res, nextSpy);
      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0]).to.equal(undefined);
    });
  });

  describe('authorizeSuperAdmin', () => {
    const req = {
      headers: {}
    };
    const res = {};

    it('should always call next()', () => {
      const nextSpy = spy();
      authorizeSuperAdmin(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
    });

    it('should call next with an error if user is not a super admin', () => {
      req.userRole = 'user';
      const nextSpy = spy();
      authorizeSuperAdmin(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);

      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0].message).to.equal('Only a Super Admin can take this action');
    });

    it('should call next middleware if user is a super admin', () => {
      req.userRole = 'superAdmin';
      const nextSpy = spy();
      authorizeSuperAdmin(req, res, nextSpy);
      const { args } = nextSpy.getCalls()[0];
      expect(nextSpy.called).to.equal(true);
      expect(args[0]).to.equal(undefined);
    });
  });
});
