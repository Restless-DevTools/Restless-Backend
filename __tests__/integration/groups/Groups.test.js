import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing Groups CRUD operations', () => {
  let groupId;
  it('should create a Group', async () => {
    const response = await request(app)
      .post('/groups/create')
      .send({
        name: 'restless-test',
        collectionId: 1,
      });
    groupId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Group', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/groups/show/${groupId}`)
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all Groups', async () => {
    const response = await request(app)
      .get('/groups/all')
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a Group', async () => {
    const response = await request(app)
      .put(`/groups/update/${groupId}`)
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Group', async () => {
    const response = await request(app)
      .delete(`/groups/delete/${groupId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
