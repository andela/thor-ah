import { expect } from 'chai';
import jwt from 'jsonwebtoken';

import TokenHelper from '../../utils/TokenHelper';

describe('token utility', () => {
  it('should have a method: generateToken', () => {
    expect(TokenHelper.generateToken).to.be.a('function');
  });

  describe('generateToken()', () => {
    const payload = {
      username: 'johndoe',
      id: 1
    };

    let generatedToken;

    before(() => {
      generatedToken = TokenHelper.generateToken(payload);
    });

    it('should return a token', () => {
      expect(generatedToken).to.be.a('string');
    });

    it('should take a payload and return a jwt token', () => {
      const verifiedToken = jwt.verify(generatedToken, process.env.JWT_KEY);
      const { exp, iat, ...actual } = verifiedToken;
      expect(actual).to.deep.equal(payload);
    });
  });

  describe('decodeToken()', () => {
    const payload = {
      username: 'johndoe',
      id: 1
    };

    let generatedToken;

    before(() => {
      generatedToken = TokenHelper.generateToken(payload);
    });

    it('should take a token and return it decoded', () => {
      const decoded = TokenHelper.decodeToken(generatedToken);
      expect(decoded.id).to.equal(payload.id);
    });
  });

  describe('decodeToken method', () => {
    it('should return error object if invalid token supplied', () => {
      const decoded = TokenHelper.decodeToken('invalid token ;)');
      expect(decoded).to.be.an('error');
    });
  });
});
