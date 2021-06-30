import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

let userId;
beforeAll(async () => {
  await models.sequelize.sync();
  const userReq = await request(app)
    .post('/users/create')
    .send({
      name: 'Teams test',
      username: 'teamsTest',
      email: 'restless-team@restless.com',
      password: 'batma123',
    });

  userId = userReq.body.id;
});

describe('Testing Teams CRUD operations', () => {
  let teamId;
  let toBeDeletedId;

  it('should create a Team', async () => {
    const response = await request(app)
      .post('/teams/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test',
        integrants: [{ userId }],
      });
    teamId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should create a Team for be deleted', async () => {
    const response = await request(app)
      .post('/teams/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test-2',
        integrants: [{ userId }],
      });
    toBeDeletedId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Team', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/teams/show/${teamId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all teams', async () => {
    const response = await request(app)
      .get('/teams/all')
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a Team', async () => {
    const response = await request(app)
      .put(`/teams/update/${teamId}`)
      .set('X-TEST-USER', userId)
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Team', async () => {
    const response = await request(app)
      .delete(`/teams/delete/${toBeDeletedId}`)
      .set('X-TEST-USER', userId)
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
