import * as request from 'supertest';
import { dbConnection, httpServer } from '../setup';

describe('Users API', () => {
  let adminUser;
  const user = {
    email: 'user@test.com',
    password: 'secret',
    firstName: 'johnny',
    lastName: 'Po',
  };
  let adminAccessToken: string;
  // let userAccessToken: string;

  beforeAll(async () => {
    await dbConnection.collection('refreshtokens').deleteMany({});
    await dbConnection.collection('users').deleteMany({});
  });

  describe('Setup user', () => {
    it('preregister user', async () => {
      let res = await request(httpServer)
        .post('/auth/register')
        .expect(201)
        .send({
          email: 'admin@test.com',
          password: 'secret',
          firstName: 'johnny',
          lastName: 'Po',
        });
      const localAccessToken = res.body.token.accessToken;

      await request(httpServer)
        .get('/auth/profile')
        .auth(localAccessToken, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          adminUser = body;
        });

      await dbConnection
        .collection('users')
        .updateMany({}, { $set: { roles: ['admin', 'user'] } });

      res = await request(httpServer).post('/auth/login').expect(201).send({
        email: 'admin@test.com',
        password: 'secret',
      });
      adminAccessToken = res.body.token.accessToken;
    });
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      await request(httpServer)
        .post('/users')
        .auth(adminAccessToken, { type: 'bearer' })
        .send(user)
        .expect(201)
        .expect(({ body }) => {
          expect(body._id).toBeDefined();
          expect(body.email).toBeDefined();
          expect(body.firstName).toBeDefined();
          expect(body.lastName).toBeDefined();
          expect(body.name).toBeDefined();
          expect(body.level).toBeDefined();
          expect(body.nReviews).toBeDefined();
          expect(body.password).not.toBeDefined();
        });

      // const res = await request(httpServer)
      //   .post('/auth/login')
      //   .expect(201)
      //   .send({
      //     email: user.email,
      //     password: user.password,
      //   });
      // userAccessToken = res.body.token.accessToken;
    });
  });

  describe('GET /users/{:id}', () => {
    it('should return an array of users', async () => {
      return await request(httpServer)
        .get(`/users/${adminUser._id}`)
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body._id).toBeDefined();
          expect(body.email).toBeDefined();
          expect(body.firstName).toBeDefined();
          expect(body.lastName).toBeDefined();
          expect(body.name).toBeDefined();
          expect(body.level).toBeDefined();
          expect(body.nReviews).toBeDefined();
          expect(body.password).not.toBeDefined();
        });
    });
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      return await request(httpServer)
        .get(`/users`)
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body[0]._id).toBeDefined();
          expect(body[0].email).toBeDefined();
          expect(body[0].firstName).toBeDefined();
          expect(body[0].lastName).toBeDefined();
          expect(body[0].name).toBeDefined();
          expect(body[0].level).toBeDefined();
          expect(body[0].nReviews).toBeDefined();
          expect(body[0].password).not.toBeDefined();
        });
    });
  });
});
