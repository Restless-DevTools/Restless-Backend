import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing users CRUD operations', () => {
  let userId;
  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name: 'Restless test',
        username: 'restlesstest',
        email: 'restless-test@restless.com',
        password: 'batma123',
      });
    userId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single User', async () => {
    const name = 'Restless test';
    const response = await request(app)
      .get(`/users/show/${userId}`)
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all users', async () => {
    const response = await request(app)
      .get('/users/all')
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a User', async () => {
    const response = await request(app)
      .put(`/users/update/${userId}`)
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a User', async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

describe('Testing the login functions', () => {
  let userId;
  const correctPassword = 'batma123';
  const wrongPassword = 'irra_nois_que_voa';
  const username = 'restlesstest';

  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name: 'Restless test',
        username,
        email: 'restless-test@restless.com',
        password: correctPassword,
      });
    userId = response.body.id;
    expect(response.status).toBe(200);
  });


  it('should login the User', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: correctPassword,
      });

    expect(response.body.status).toBe(true);
  });

  it('should not login the User', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username,
        password: wrongPassword,
      });

    expect(response.status).toBe(401);
  });

  it('should get a bad request', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username,
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

afterAll(() => {
  models.sequelize.close();
});
