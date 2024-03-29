import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing request recover password functions', () => {
  const username = 'requestRecoverTest';
  const email = 'requestRecoverTest@restlessdevtools.com';
  let userId;

  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name: 'Restless test',
        username,
        email,
        password: 'batma123',
      });

    userId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should create a verification code by username', async () => {
    const response = await request(app)
      .post('/auth/request-recover-password')
      .send({
        username,
      });
    expect(response.status).toBe(200);
  });

  it('should create a verification code by email', async () => {
    const response = await request(app)
      .post('/auth/request-recover-password')
      .send({
        email,
      });
    expect(response.status).toBe(200);
  });

  it('should fail on create a verification code', async () => {
    const response = await request(app)
      .post('/auth/request-recover-password')
      .send({
        username: '',
      });
    expect(response.status).toBe(400);
  });

  it('should delete a User', async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

describe('Testing recover password functions', () => {
  const username = 'recoverPassword';
  const email = 'recoverPassword@restlessdevtools.com';
  let userId;

  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name: 'Restless test',
        username,
        email,
        password: 'batma123',
      });

    userId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should create a verification code by username', async () => {
    const response = await request(app)
      .post('/auth/request-recover-password')
      .send({
        username,
      });
    expect(response.status).toBe(200);
  });

  it('should fail on recover password', async () => {
    const response = await request(app)
      .post('/auth/recover-password')
      .send({
        password: 'robin123',
      });

    expect(response.status).toBe(400);
  });

  it('should fail on recover password by invalid code', async () => {
    const response = await request(app)
      .post('/auth/recover-password')
      .send({
        verificationCode: 123,
        password: 'robin123',
      });

    expect(response.body.status).toBe(false);
  });

  it('should delete a User', async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
