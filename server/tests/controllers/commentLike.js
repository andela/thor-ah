import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../..';
import TokenHelper from '../../utils/TokenHelper';

require('dotenv').config();

chai.should();
chai.use(chaiHttp);

const token1 = `Bearer ${TokenHelper.generateToken({ id: 3, username: 'randomUser' })}`;
const token2 = `Bearer ${TokenHelper.generateToken({ id: 4, username: 'awesomeAuthor' })}`;
const token3 = `Bearer ${TokenHelper.generateToken({ id: 6, username: 'danieladek' })}`;

describe('Comment Like Controller', () => {
  describe('likeOrDislikeComment', () => {
    it('should like a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/like')
        .set('Authorization', token1)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should be able to remove like from a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/like')
        .set('Authorization', token1)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('comment like removed');
          done();
        });
    });
    it('should dislike a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/dislike')
        .set('Authorization', token1)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should be able to remove dislike from a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/dislike')
        .set('Authorization', token1)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('comment dislike removed');
          done();
        });
    });
    it('should like the same comment from another user', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/like')
        .set('Authorization', token2)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should change reaction to dislike type if user selects an opposite reaction', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/dislike')
        .set('Authorization', token2)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comment disliked');
          done();
        });
    });
    it('should change reaction to like type if user selects an opposite reaction', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/like')
        .set('Authorization', token2)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comment liked');
          done();
        });
    });
    it('should return error if comment does not exist', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/10/dislike')
        .set('Authorization', token3)
        .send()
        .end((err, res) => {
          const { message } = res.body.error;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(message).to.equal('comment does not exist');
          done();
        });
    });
    it('should be able to dislike comment after after unliking it', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/dislike')
        .set('Authorization', token1)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('checkReactionStatus', () => {
    it('should return false if logged in user disliked the comment', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1/reaction_status')
        .set('Authorization', token1)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.reactionStatus).to.equal(false);
          done();
        });
    });
    it('should return true if logged in user liked the comment', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1/reaction_status')
        .set('Authorization', token2)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.reactionStatus).to.equal(true);
          done();
        });
    });
    it('should return a specific message if logged in user does not have any reaction the comment', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1/reaction_status')
        .set('Authorization', token3)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('you have not reacted to this comment');
          done();
        });
    });
  });
});
