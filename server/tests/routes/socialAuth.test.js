import { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';


chai.use(chaiHttp);

describe('The social auth login route', () => {
  describe('/GET /api/auth/facebook', () => {
    it('finds a user by the facebook id', (done) => {
      chai
        .request(server)
        .get('api/auth/facebook')
        .end(err, res) => {
          expect(res.status).to.equal()
        }
    });
  });
});