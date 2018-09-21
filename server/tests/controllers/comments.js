/* eslint-disable no-unused-expressions */
import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import log from 'fancy-log';

import app from '../../../index';
import TokenHelper from '../../utils/TokenHelper';
import db from '../../models';

chai.use(chaiHttp);

const token = `Bearer ${TokenHelper.generateToken({ id: 6, username: 'somename' })}`;
const comment = {
  comment: 'Some insightful comment'
};

const reply = {
  reply: 'some reply to some insightful comment'
};

const commentUpdatePayload = {
  comment: 'updated the content of insightful comment'
};

const highlightedComment = {
  noArticleBody: {
    comment: 'Some insightful comment',
    cssId: 'someVal12',
    highlighted: 'test article'
  },
  noHighlightedText: {
    comment: 'Some insightful comment',
    cssId: 'someVal12',
    articleBody: 'test article body'
  },
  noCssId: {
    comment: 'Some insightful comment',
    highlighted: 'test article',
    articleBody: 'test article body'
  },
  mismatch: {
    comment: 'Some insightful comment',
    cssId: 'someVal12',
    highlighted: 'test article',
    articleBody: 'test article body'
  },
  complete: {
    comment: 'Some insightful comment',
    cssId: 'someVal12',
    highlighted: 'test article',
    articleBody: 'test <span id=“someVal12” class=“highlighted”>article </span>body'
  }
};

describe('Comment Controller', () => {
  // drop(if exists) and create user table
  before((done) => {
    db.Article.sync({ force: true, logging: false })
      .then(() => {
        db.Comment.sync({ force: true, logging: false })
          .then(() => {
            done();
          });
      });
  });

  before((done) => {
    db.Article.create({
      title: 'test article',
      slug: 'test-article-slug12345',
      description: 'test article description',
      body: 'test article body',
      authorId: 1,
      likeDislikeId: 1
    })
      .then(() => done())
      .catch(e => log(e));
  });

  describe('createComment', () => {
    it('should create a comment to an article', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(comment)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          done();
        });
    });

    it('should get a single comment to an article by its id', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.body).to.equal('Some insightful comment');
          done();
        });
    });

    it('should return error if comment does not exist', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/10')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('comment does not exist');
          done();
        });
    });

    it('should return the created comment in the response', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(comment)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          const { comment } = res.body; // eslint-disable-line no-shadow
          comment.should.be.an('object');
          comment.should.have.property('commenter');
          comment.should.have.property('article');
          done();
        });
    });

    it('should return a 404 if article no longer exists', (done) => {
      request(app)
        .post('/api/articles/test-article-slug-does-not-exist/comments')
        .set('Authorization', token)
        .send(comment)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });

    // for highlighted comment
    it('should return error if articleBody is missing', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(highlightedComment.noArticleBody)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.error.articleBody).to.equal('injected article body missing');
          done();
        });
    });

    it('should return error if highlighted text is missing', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(highlightedComment.noHighlightedText)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.error.highlighted).to.equal('highlighted text missing');
          done();
        });
    });

    it('should return error if cssId is missing', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(highlightedComment.noCssId)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.error.cssId).to.equal('cssId missing');
          done();
        });
    });

    it('should return error if injected body mismatch', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(highlightedComment.mismatch)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.error.articleBody).to.equal('injected article body: characters mismatch');
          done();
        });
    });

    it('should create a highlighted-comment to an article', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .send(highlightedComment.complete)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    // end of highloighted comment specific
  });

  describe('createCommentReply', () => {
    it('should create a reply to a comment', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .send(reply)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          done();
        });
    });

    it('should return the created reply in the response', (done) => {
      request(app)
        .post('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .send(reply)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          const { commentReply } = res.body; // eslint-disable-line no-shadow
          commentReply.should.be.an('object');
          commentReply.should.have.property('commenter');
          commentReply.should.have.property('comment');
          done();
        });
    });

    it('should return a 404 if comment no longer exists', (done) => {
      request(app)
        .post('/api/articles/test-article-slug-does-not-exist/comments/54')
        .set('Authorization', token)
        .send(reply)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('getArticleComments', () => {
    it('should fetch all comments and replies for an article', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });

    it('should return a 404 if article does not exist', (done) => {
      request(app)
        .post('/api/articles/test-article-slug-does-not-exist/comments')
        .set('Authorization', token)
        .send(reply)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment', (done) => {
      request(app)
        .put('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .send(commentUpdatePayload)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });

    it('should return a 404 error for a non-existing comment', (done) => {
      request(app)
        .put('/api/articles/test-article-slug12345/comments/4000')
        .set('Authorization', token)
        .send(commentUpdatePayload)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should not allow a user update another users\' comment', (done) => {
      const unauthorizedUserToken = `Bearer ${TokenHelper.generateToken({ id: 10 })}`;
      request(app)
        .put('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', unauthorizedUserToken)
        .send(commentUpdatePayload)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should return the updated comment', (done) => {
      request(app)
        .put('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .send(commentUpdatePayload)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.body.comment).to.be.an('object');
          done();
        });
    });

    it('should set the \'isEdited\' field to true', (done) => {
      request(app)
        .put('/api/articles/test-article-slug12345/comments/1')
        .set('Authorization', token)
        .send(commentUpdatePayload)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.type).to.equal('application/json');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment.isEdited).to.equal(true);
          done();
        });
    });
  });

  describe('getCommentEdits', () => {
    it('should fetch all edits for a comment', (done) => {
      request(app)
        .get('/api/articles/test-article-slug12345/comments/1/edits')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.history).to.be.an('array');
          done();
        });
    });

    it('should return a 404 if comment does not exist', (done) => {
      request(app)
        .post('/api/articles/test-article-slug-slug12345/comments/3939')
        .set('Authorization', token)
        .send(reply)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
});
