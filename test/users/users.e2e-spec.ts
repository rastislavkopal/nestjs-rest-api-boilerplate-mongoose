import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';
import * as request from 'supertest';
import { userStub } from './stubs/user.stub';
// import { adminStub } from './stubs/admin.stub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('Users API', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  // let adminAccessToken;
  // let userAccessToken;
  // let dbUsers;
  // let user: CreateUserDto = userStub();
  // let admin: CreateUserDto;

  // const password = '123456';
  // const passwordHashed = await bcrypt.hash(password, 1);

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

    // const router = httpServer._events.request._router;
    // const availableRoutes: [] = router.stack
    //   .map((layer) => {
    //     if (layer.route) {
    //       return {
    //         route: {
    //           path: layer.route?.path,
    //           method: layer.route?.stack[0].method,
    //         },
    //       };
    //     }
    //   })
    //   .filter((item) => item !== undefined);
    // console.log(availableRoutes);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});

    // user = {
    //   email: 'martin.kov@gmail.com',
    //   password,
    //   firstName: 'Martin',
    //   lastName: 'Kov',
    // };

    // admin = {
    //   email: 'matus.knd@gmail.com',
    //   password,
    //   firstName: 'Matus',
    //   lastName: 'Knd',
    // };
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const usr: CreateUserDto = userStub();
      const response = await request(httpServer).post('/users/notfo').send(usr);

      expect(response.status).toBe(404);
      // expect(response.body).toMatchObject();

      // const user = await dbConnection
      //   .collection('users')
      //   .findOne({ email: userStub().email });
      // expect(user).toMatchObject(usr);
    });
  });

  // describe('GET /users/{:id}', () => {
  //   it('should return an array of users', async () => {
  //     await dbConnection.collection('users').insertOne(adminStub);
  //     const response = await request(httpServer).get('/users');

  //     expect(response.status).toBe(200);
  //     expect(response.body).toMatchObject([userStub()]);
  //   });
  // });

  // describe('GET /users', () => {
  //   it('should return an array of users', async () => {
  //     await dbConnection.collection('users').insertOne(adminStub);
  //     const response = await request(httpServer).get('/users');

  //     expect(response.status).toBe(200);
  //     expect(response.body).toMatchObject([userStub()]);
  //   });
  // });
});
