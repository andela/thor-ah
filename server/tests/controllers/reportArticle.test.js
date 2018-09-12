import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import log from 'fancy-log';
import app from '../../..';
import TokenHelper from '../../utils/TokenHelper';
import db from '../../models';

const { Article } = db;

require('dotenv').config();

chai.should();
chai.use(chaiHttp);

const userToken1 = `Bearer ${TokenHelper.generateToken({ id: 3, username: 'randomUser' })}`;
const userToken2 = `Bearer ${TokenHelper.generateToken({ id: 2, username: 'randomAuthor2' })}`;
const userToken3 = `Bearer ${TokenHelper.generateToken({ id: 4, username: 'randomAuthor2' })}`;
const adminToken = `Bearer ${TokenHelper.generateToken({ id: 1, username: 'thor', role: 'admin' })}`;

const properReportInput1 = {
  reasonForReport: 'other',
  reportBody: 'This author insulted us. Not cool'
};
const properReportInput2 = { reasonForReport: 'it is a spam' };
const inproperReportInput1 = { reasonForReport: '' };
const inproperReportInput2 = {
  reasonForReport: 'other',
  reportBody: ''
};

describe('Reports on Article controller', () => {
  before((done) => {
    Article.create({
      title: 'badly written article',
      slug: 'badly-written-article-slug12345',
      description: 'Lazy Readers',
      body: 'Lazy Readers',
      authorId: 3,
      likeDislikeId: 1
    })
      .then(() => done())
      .catch(e => log(e));
  });

  describe('reportAnArticle', () => {
    it('should successfuly send a report with a reason and further explanation', (done) => {
      request(app)
        .post('/api/articles/badly-written-article-slug12345/report')
        .set('Authorization', userToken1)
        .send(properReportInput1)
        .end((err, res) => {
          const { status, report } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(status).to.equal('success');
          expect(report.reportBody).to.equal('This author insulted us. Not cool');
          done();
        });
    });
    it('should successfuly send a report with just the reason input', (done) => {
      request(app)
        .post('/api/articles/badly-written-article-slug12345/report')
        .set('Authorization', userToken2)
        .send(properReportInput2)
        .end((err, res) => {
          const { status, report } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(status).to.equal('success');
          expect(report.reasonForReport).to.equal('it is a spam');
          done();
        });
    });
    it('should return error with when user gives just the "others" reason without a body', (done) => {
      request(app)
        .post('/api/articles/badly-written-article-slug12345/report')
        .set('Authorization', userToken3)
        .send(inproperReportInput2)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(status).to.equal('error');
          expect(error.reportBody).to.equal('please let us know your concerns about this article');
          done();
        });
    });
    it('should return error with when user gives no input', (done) => {
      request(app)
        .post('/api/articles/badly-written-article-slug12345/report')
        .set('Authorization', userToken3)
        .send(inproperReportInput1)
        .end((err, res) => {
          const { status, error } = res.body;
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(400);
          expect(status).to.equal('error');
          expect(error.reasonForReport).to.equal('please select a reason for your report');
          done();
        });
    });
  });

  describe('getReports', () => {
    it('should return all reports on articles to admin', (done) => {
      request(app)
        .get('/api/admin/articles/reports')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return all reports on a single article to admin', (done) => {
      request(app)
        .get('/api/admin/reports/articles/badly-written-article-slug12345')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return a single report to admin', (done) => {
      request(app)
        .get('/api/admin/articles/reports/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return return error if user is not an admin', (done) => {
      request(app)
        .get('/api/admin/articles/reports/1')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
  describe('blockArticle', () => {
    it('Should block an article from users if it violates terms', (done) => {
      request(app)
        .put('/api/admin/articles/badly-written-article-slug12345/block')
        .set('Authorization', adminToken)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Article has been successfully blocked');
          done();
        });
    });
    it('Should return error if article does not exist', (done) => {
      request(app)
        .put('/api/admin/articles/badly-written-articl/block')
        .set('Authorization', adminToken)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.error.message).to.equal('Article does not exist');
          done();
        });
    });
  });
  describe('getBlockedArticles', () => {
    it('Should get all blocked articles', (done) => {
      request(app)
        .get('/api/admin/articles/blocked')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
    it('Should get a blocked article', (done) => {
      request(app)
        .get('/api/admin/articles/badly-written-article-slug12345/blocked')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  });
  describe('blockArticle', () => {
    it('Should unblock a blocked article', (done) => {
      request(app)
        .put('/api/admin/articles/badly-written-article-slug12345/unblock')
        .set('Authorization', adminToken)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Article has been successfully unblocked');
          done();
        });
    });
    it('Should return error if article does not exist', (done) => {
      request(app)
        .put('/api/admin/articles/badly-written-articl/unblock')
        .set('Authorization', adminToken)
        .send()
        .end((err, res) => {
          expect(res.type).to.equal('application/json');
          expect(res.status).to.equal(404);
          expect(res.body.error.message).to.equal('Article does not exist');
          done();
        });
    });
  });
});
