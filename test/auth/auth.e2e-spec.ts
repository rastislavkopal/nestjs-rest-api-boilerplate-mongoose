import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';
import * as request from 'supertest';

describe('Auth API', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  const user = {
    email: 'johnny.po@test.com',
    password: 'secret',
    firstName: 'johnny',
    lastName: 'Po',
  };
  let userAccessToken: string;
  let userRefreshToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();

    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('refreshtokens').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('refreshtokens').deleteMany({});
    await dbConnection.close();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(httpServer).post('/auth/register').send(user);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toHaveProperty('tokenType');
      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.token).toHaveProperty('refreshToken');
      expect(res.body.token).toHaveProperty('expiresIn');

      userAccessToken = res.body.token.accessToken;
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const res = await request(httpServer).post('/auth/login').send(user);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toHaveProperty('tokenType');
      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.token).toHaveProperty('refreshToken');
      expect(res.body.token).toHaveProperty('expiresIn');

      userRefreshToken = res.body.token.refreshToken;
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return new access token to user', async () => {
      const res = await request(httpServer).post('/auth/refresh-token').send({
        email: user.email,
        refreshToken: userRefreshToken,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toHaveProperty('tokenType');
      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.token).toHaveProperty('refreshToken');
      expect(res.body.token).toHaveProperty('expiresIn');
    });
  });

  describe('GET /auth/profile', () => {
    it('Should return logged user profile', async () => {
      return await request(httpServer)
        .get('/auth/profile')
        .auth(userAccessToken, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          // expect(response.body).toMatchObject(User);
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
});
