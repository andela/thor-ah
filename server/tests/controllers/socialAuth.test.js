import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../..';


chai.use(chaiHttp);



describe('The social auth login route', () => {
  describe('/POST /api/auth/facebook', () => {
    it('finds a user by the facebook id', (done) => {
      chai
        .request(app)
        .post('api/auth/facebook')
        .send({
          firstName: 'Thor',
          lastName: 'class39',
          username: 'IwillExcel',
          email: 'mountainview@andela.com'
        })
        .end(err, res) => {
          expect(res.status).to.equal()
        }
    });
  });
});