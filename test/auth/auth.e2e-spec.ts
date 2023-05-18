import * as request from 'supertest';
import { dbConnection, httpServer } from '../setup';
import { HttpStatus } from '@nestjs/common';

describe('Auth API', () => {
  const user = {
    email: 'johnny.po@test.com',
    password: 'secret',
    firstName: 'johnny',
    lastName: 'Po',
  };
  let userAccessToken: string;
  let userRefreshToken: string;

  beforeAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('refreshtokens').deleteMany({});
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
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user).toHaveProperty('firstName');
      expect(res.body.user).toHaveProperty('lastName');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).not.toHaveProperty('password');

      userAccessToken = res.body.token.accessToken;
    });

    it('should report error when email already exists', () => {
      return request(httpServer)
        .post('/auth/register')
        .send(user)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('email');
        });
    });

    it('should report error when the email provided is not valid', () => {
      return request(httpServer)
        .post('/auth/register')
        .send({
          email: 'this_is_not_an_email',
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('email');
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(httpServer)
        .post('/auth/register')
        .send({ email: 'email@email.com' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('password');
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const res = await request(httpServer).post('/auth/login').send(user);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toHaveProperty('tokenType');
      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.token).toHaveProperty('refreshToken');
      expect(res.body.token).toHaveProperty('expiresIn');

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user).toHaveProperty('firstName');
      expect(res.body.user).toHaveProperty('lastName');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).not.toHaveProperty('password');

      userRefreshToken = res.body.token.refreshToken;
    });

    it('should report error when email is not provided', () => {
      return request(httpServer)
        .post('/auth/login')
        .send({ email: 'login@email.com' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('password');
        });
    });

    it('should report error when password is not provided', () => {
      return request(httpServer)
        .post('/auth/login')
        .send({ password: 'super_secret' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('email');
        });
    });

    it('should report error when the email provided is not valid', () => {
      return request(httpServer)
        .post('/auth/login')
        .send({
          email: 'not-found@email.com',
          password: 'secretpwd',
        })
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          const { statusCode, message } = res.body;
          expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
          expect(message).toEqual('Email not found');
        });
    });

    it("should report error when email and password don't match", () => {
      return request(httpServer)
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'oopsie_incorrect',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          const { statusCode, message } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(message).toEqual('incorrectPassword');
        });
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return a new accessToken when refreshToken and email match', async () => {
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

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user).toHaveProperty('firstName');
      expect(res.body.user).toHaveProperty('lastName');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it("should report error when email and refreshToken don't match", async () => {
      return request(httpServer)
        .post('/auth/refresh-token')
        .send({ email: 'incorrect@email.com', refreshToken: userRefreshToken })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          const { statusCode, message } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(message).toEqual('Invalid refresh token');
        });
    });

    it('should report error when email and refreshToken are not provided', () => {
      return request(httpServer)
        .post('/auth/refresh-token')
        .send({ email: 'email@email.com' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          const { statusCode, errors } = res.body;
          expect(statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(errors).toHaveProperty('refreshToken');
        });
    });

    it('should report error when the refreshToken is invalid', async () => {
      return request(httpServer)
        .post('/auth/refresh-token')
        .send({ email: user.email, refreshToken: `${userAccessToken}d%1)dsd` })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.statusCode).toEqual(401);
          expect(res.body.message).toEqual('Invalid refresh token');
        });
    });
  });

  describe('GET /auth/profile', () => {
    it('Should return logged user profile', async () => {
      const res = await request(httpServer)
        .get('/auth/profile')
        .auth(userAccessToken, { type: 'bearer' })
        .expect(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('firstName');
      expect(res.body).toHaveProperty('lastName');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('level');
      expect(res.body).toHaveProperty('nReviews');
      expect(res.body).not.toHaveProperty('password');
    });
  });

  // describe('POST /auth/send-password-reset', () => {
  //   it('should send an email with password reset link when email matches a user', async () => {
  //     const PasswordResetTokenObj = await PasswordResetToken.create(resetToken);

  //     expect(PasswordResetTokenObj.resetToken).toEqual(
  //       '5947397b323ae82d8c3a333b.c69d0435e62c9f4953af912442a3d064e20291f0d228c0552ed4be473e7d191ba40b18c2c47e8b9d',
  //     );
  //     expect(PasswordResetTokenObj.userId.toString()).toEqual(
  //       '5947397b323ae82d8c3a333b',
  //     );
  //     expect(PasswordResetTokenObj.userEmail).toEqual(dbUser.email);
  //     expect(PasswordResetTokenObj.expires).to.be.above(
  //       moment().add(1, 'hour').toDate(),
  //     );

  //     sandbox
  //       .stub(emailProvider, 'sendPasswordReset')
  //       .callsFake(() => Promise.resolve('email sent'));

  //     return request(httpServer)
  //       .post('/auth/send-password-reset')
  //       .send({ email: dbUser.email })
  //       .expect(HttpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).toEqual('success');
  //       });
  //   });

  //   it("should report error when email doesn't match a user", async () => {
  //     await PasswordResetToken.create(resetToken);
  //     return request(httpServer)
  //       .post('/auth/send-password-reset')
  //       .send({ email: user.email })
  //       .expect(HttpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         const { code } = res.body;
  //         const { message } = res.body;
  //         expect(code).toEqual(HttpStatus.UNAUTHORIZED);
  //         expect(message).toEqual('No account found with that email');
  //       });
  //   });

  //   it('should report error when email is not provided', () => {
  //     return request(httpServer)
  //       .post('/auth/send-password-reset')
  //       .send({})
  //       .expect(HttpStatus.UNPROCESSABLE_ENTITY)
  //       .then((res) => {
  //         const field1 = res.body.errors[0].field;
  //         const location1 = res.body.errors[0].location;
  //         const messages1 = res.body.errors[0].messages;
  //         expect(field1).toEqual('email');
  //         expect(location1).toEqual('body');
  //         expect(messages1).to.include('"email" is required');
  //       });
  //   });
  // });

  // describe('POST /auth/reset-password', () => {
  //   it('should update password and send confirmation email when email and reset token are valid', async () => {
  //     await PasswordResetToken.create(resetToken);

  //     sandbox
  //       .stub(emailProvider, 'sendPasswordChangeEmail')
  //       .callsFake(() => Promise.resolve('email sent'));

  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({
  //         email: dbUser.email,
  //         password: 'updatedPassword2',
  //         resetToken: resetToken.resetToken,
  //       })
  //       .expect(HttpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).toEqual('Password Updated');
  //       });
  //   });
  //   it("should report error when email and reset token doesn't match a user", async () => {
  //     await PasswordResetToken.create(resetToken);
  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({
  //         email: user.email,
  //         password: 'updatedPassword',
  //         resetToken: resetToken.resetToken,
  //       })
  //       .expect(HttpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         const { code } = res.body;
  //         const { message } = res.body;
  //         expect(code).toEqual(401);
  //         expect(message).toEqual('Cannot find matching reset token');
  //       });
  //   });

  //   it('should report error when email is not provided', () => {
  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({
  //         password: 'updatedPassword',
  //         resetToken: resetToken.resetToken,
  //       })
  //       .expect(HttpStatus.UNPROCESSABLE_ENTITY)
  //       .then((res) => {
  //         const field1 = res.body.errors[0].field;
  //         const location1 = res.body.errors[0].location;
  //         const messages1 = res.body.errors[0].messages;
  //         expect(field1).toEqual('email');
  //         expect(location1).toEqual('body');
  //         expect(messages1).to.include('"email" is required');
  //       });
  //   });
  //   it('should report error when reset token is not provided', () => {
  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({ email: dbUser.email, password: 'updatedPassword' })
  //       .expect(HttpStatus.UNPROCESSABLE_ENTITY)
  //       .then((res) => {
  //         const field1 = res.body.errors[0].field;
  //         const location1 = res.body.errors[0].location;
  //         const messages1 = res.body.errors[0].messages;
  //         expect(field1).toEqual('resetToken');
  //         expect(location1).toEqual('body');
  //         expect(messages1).to.include('"resetToken" is required');
  //       });
  //   });
  //   it('should report error when password is not provided', () => {
  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({ email: dbUser.email, resetToken: resetToken.resetToken })
  //       .expect(HttpStatus.UNPROCESSABLE_ENTITY)
  //       .then((res) => {
  //         const field1 = res.body.errors[0].field;
  //         const location1 = res.body.errors[0].location;
  //         const messages1 = res.body.errors[0].messages;
  //         expect(field1).toEqual('password');
  //         expect(location1).toEqual('body');
  //         expect(messages1).to.include('"password" is required');
  //       });
  //   });

  //   it('should report error when the resetToken is expired', async () => {
  //     const expiredPasswordResetTokenObj = await PasswordResetToken.create(
  //       expiredResetToken,
  //     );

  //     expect(expiredPasswordResetTokenObj.resetToken).toEqual(
  //       '5947397b323ae82d8c3a333b.c69d0435e62c9f4953af912442a3d064e20291f0d228c0552ed4be473e7d191ba40b18c2c47e8b9d',
  //     );
  //     expect(expiredPasswordResetTokenObj.userId.toString()).toEqual(
  //       '5947397b323ae82d8c3a333b',
  //     );
  //     expect(expiredPasswordResetTokenObj.userEmail).toEqual(dbUser.email);
  //     expect(expiredPasswordResetTokenObj.expires).to.be.below(
  //       moment().toDate(),
  //     );

  //     return request(httpServer)
  //       .post('/auth/reset-password')
  //       .send({
  //         email: dbUser.email,
  //         password: 'updated password',
  //         resetToken: expiredResetToken.resetToken,
  //       })
  //       .expect(HttpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         expect(res.body.code).toEqual(401);
  //         expect(res.body.message).to.include('Reset token is expired');
  //       });
  //   });
  // });
});
