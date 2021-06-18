import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

let userId;
beforeAll(async () => {
  await models.sequelize.sync();

  const userReq = await request(app)
    .post('/users/create')
    .send({
      name: 'collectionTest',
      username: 'collectionTest',
      email: 'restless-collection@restless.com',
      password: 'batma123',
    });

  userId = userReq.body.id;
});

describe('Testing Collection CRUD operations', () => {
  let collectionId;

  it('should create a Collection', async () => {
    const response = await request(app)
      .post('/collections/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test',
        shareOption: 'PUBLIC',
        description: 'test',
        sharedPermissions: 'WRITE',
      });
    expect(response.status).toBe(200);
  });

  it('should create a Collection for delete', async () => {
    const response = await request(app)
      .post('/collections/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test',
        shareOption: 'PUBLIC',
        description: 'test',
        sharedPermissions: 'WRITE',
      });
    collectionId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Collection', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/collections/show/${collectionId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should update a Collection', async () => {
    const response = await request(app)
      .put(`/collections/update/${collectionId}`)
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Collection', async () => {
    const response = await request(app)
      .delete(`/collections/delete/${collectionId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.status).toBe(200);
  });

  it('should fail on create a Collection', async () => {
    const response = await request(app)
      .post('/collections/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test',
        shareOption: 'JDSDSF',
        description: 'test',
      });
    expect(response.status).toBe(400);
  });
});

afterAll(() => {
  models.sequelize.close();
});
