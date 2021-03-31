import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing Teams CRUD operations', () => {
  let teamId;
  it('should create a Team', async () => {
    const response = await request(app)
      .post('/teams/create')
      .send({
        name: 'restless-test',
      });
    teamId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Team', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/teams/show/${teamId}`)
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all teams', async () => {
    const response = await request(app)
      .get('/teams/all')
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a Team', async () => {
    const response = await request(app)
      .put(`/teams/update/${teamId}`)
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Team', async () => {
    const response = await request(app)
      .delete(`/teams/delete/${teamId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
