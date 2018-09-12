// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import dotenv from 'dotenv';
// import app from '../../../index';

// dotenv.config();
// chai.use(chaiHttp);

// const userPassword = process.env.USER_PASSWORD;
// const user = {
//   email: 'su@mail.com',
//   password: userPassword
// };
// let userToken;

// describe('Get users reading stats', () => {
//   before((done) => {
//     chai.request(app)
//       .post('/api/users')
//       .send(user)
//       .end((req, res) => {
//         userToken = res.body.user.token;
//         done();
//       });
//   });

//   describe('Users can get their reading stats', () => {
//     it('Gets user\'s reading stats', (done) => {
//       chai.request(app)
//         .get('/api/user-reading-stats')
//         .set('Content-Type', 'application/json')
//         .set('Authorization', `Bearer ${userToken}`)
//         .set('Accept', 'application/json')
//         .end((req, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.status).to.equal('success');
//           done();
//         });
//     });

//     it('Gets user\'s reading stats', (done) => {
//       chai.request(app)
//         .get('/api/user-reading-stats')
//         .set('Content-Type', 'application/json')
//         .set('Authorization', `Bearer ${userToken}`)
//         .set('Accept', 'application/json')
//         .end((req, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.status).to.equal('success');
//           done();
//         });
//     });
//   });
// });
