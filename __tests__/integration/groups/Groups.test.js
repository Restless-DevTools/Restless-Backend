import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

let userId;
beforeAll(async () => {
  await models.sequelize.sync();

  const userReq = await request(app)
    .post('/users/create')
    .send({
      name: 'groupsTest',
      username: 'groupsTest',
      email: 'restless-groups@restless.com',
      password: 'batma123',
    });

  userId = userReq.body.id;
});

describe('Testing Groups CRUD operations', () => {
  let groupId;

  it('should create a Group', async () => {
    const response = await request(app)
      .post('/groups/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test',
      });
    groupId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a single Group', async () => {
    const name = 'restless-test';
    const response = await request(app)
      .get(`/groups/show/${groupId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should update a Group', async () => {
    const response = await request(app)
      .put(`/groups/update/${groupId}`)
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restless-test-2',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a Group', async () => {
    const response = await request(app)
      .delete(`/groups/delete/${groupId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
