import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing Collection CRUD operations', () => {
  let collectionId;
  it('should create a Collection', async () => {
    const response = await request(app)
      .post('/collections/create')
      .send({
        name: 'restless-test',
        permissionType: 'PUBLIC',
        description: 'test',
      });
    collectionId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Collection', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/collections/show/${collectionId}`)
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all Collections', async () => {
    const response = await request(app)
      .get('/collections/all')
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a Collection', async () => {
    const response = await request(app)
      .put(`/collections/update/${collectionId}`)
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Collection', async () => {
    const response = await request(app)
      .delete(`/collections/delete/${collectionId}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('should fail on create a Collection', async () => {
    const response = await request(app)
      .post('/collections/create')
      .send({
        name: 'restless-test',
        permissionType: 'JDSDSF',
        description: 'test',
      });
    expect(response.status).toBe(400);
  });
});

afterAll(() => {
  models.sequelize.close();
});
