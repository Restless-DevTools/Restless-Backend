import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

let userId;
beforeAll(async () => {
  await models.sequelize.sync();

  const userReq = await request(app)
    .post('/users/create')
    .send({
      name: 'Snippets test',
      username: 'snippetsTest',
      email: 'restless-snippets@restless.com',
      password: 'batma123',
    });

  userId = userReq.body.id;
});

describe('Testing snippets CRUD operations', () => {
  let snippetId;

  it('should create a snippet', async () => {
    const response = await request(app)
      .post('/snippets/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restlessScale.js',
        description: 'A script that will make us the most used developer tools in the world',
        code: `
          function handleScaleUp(users) {
            giveUsMoney(5 * users);
            console.log('we are rich!');
          }
          handleScaleUp(1000);
        `,
        language: 'javascript',
        shareOption: 'PUBLIC',
      });
    snippetId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should fail on create a snippet', async () => {
    const response = await request(app)
      .post('/snippets/create')
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restlessScale.js',
        description: 'A script that will make us the most used developer tools in the world',
      });
    expect(response.status).toBe(400);
  });

  it('should return a single snippet', async () => {
    const name = 'restlessScale.js';
    const response = await request(app)
      .get(`/snippets/show/${snippetId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all snippets', async () => {
    const response = await request(app)
      .get('/snippets/all')
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a snippet', async () => {
    const response = await request(app)
      .put(`/snippets/update/${snippetId}`)
      .set({ 'X-TEST-USER': userId })
      .send({
        name: 'restlessAlreadyScale.js',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a snippet', async () => {
    const response = await request(app)
      .delete(`/snippets/delete/${snippetId}`)
      .set({ 'X-TEST-USER': userId })
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
