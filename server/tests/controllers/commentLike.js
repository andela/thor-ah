import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../..';
import TokenHelper from '../../utils/TokenHelper';

require('dotenv').config();

chai.should();
chai.use(chaiHttp);

const token1 = `Bearer ${TokenHelper.generateToken({ id: 2, username: 'randomUser' })}`;
const token2 = `Bearer ${TokenHelper.generateToken({ id: 3, username: 'randomAuthor1' })}`;

describe('Comment Like Controller', () => {
  describe('likeOrDislikeComment', () => {
    it('should like a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/like')
        .set('Authorization', token1)
        .send({
          reaction: 'liked',
        })
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
        .send({
          reaction: 'liked',
        })
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
        .send({
          reaction: 'disliked',
        })
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
        .send({
          reaction: 'disliked',
        })
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
        .send({
          reaction: 'liked',
        })
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return error if user dislike an already-liked comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1/dislike')
        .set('Authorization', token2)
        .send({
          reaction: 'disliked',
        })
        .end((err, res) => {
          const { message } = res.body.error;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(message).to.equal('You have already liked this comment');
          done();
        });
    });
    it('should return error if comment does not exist', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/10/dislike')
        .set('Authorization', token2)
        .send({
          reaction: 'disliked',
        })
        .end((err, res) => {
          const { message } = res.body.error;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(message).to.equal('comment does not exist');
          done();
        });
    });
    it('should get number of likes and dislikes on a comment', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1/reactions')
        .set('Authorization', token2)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  });
});
