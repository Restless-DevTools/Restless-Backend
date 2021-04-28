import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing users CRUD operations', () => {
  const name = 'Restless test';
  const username = 'usersTest';
  const email = 'usersTest@restlessdevtools.com';
  let userId;

  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name,
        username,
        email,
        password: 'batma123',
      });

    userId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single User', async () => {
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
        name: 'Restless test 2',
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
  const name = 'Restless test';
  const username = 'loginTest';
  const email = 'loginTest@restlessdevtools.com';
  const correctPassword = 'batma123';
  const wrongPassword = 'irra_nois_que_voa';
  let userId;
  let token;

  it('should create a User', async () => {
    const response = await request(app)
      .post('/users/create')
      .send({
        name,
        username,
        email,
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

    token = response.body.token;
    expect(response.body.user.username).toBe(username);
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

  it('should validate token', async () => {
    const response = await request(app)
      .post('/auth/validate-token')
      .send({ token });

    expect(response.status).toBe(200);
  });

  it('should fail on validate token', async () => {
    const response = await request(app)
      .post('/auth/validate-token')
      .send({ token: `${token}-irra` });

    expect(response.status).toBe(401);
  });

  it('should get a bad request on GitHub login', async () => {
    const response = await request(app)
      .post('/auth/github-login')
      .send({ wrongProp: 'wrong value' });

    expect(response.status).toBe(400);
  });

  it('should fail on GitHub login with wrong code', async () => {
    const response = await request(app)
      .post('/auth/github-login')
      .send({ code: 'random-code' });

    expect(response.body.status).toBe(false);
  });
});

afterAll(() => {
  models.sequelize.close();
});
