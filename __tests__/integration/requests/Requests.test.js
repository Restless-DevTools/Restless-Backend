import request from 'supertest';
import app from '../../../src/index';
import models from '../../../src/models';

beforeAll(async () => {
  await models.sequelize.sync();
});

describe('Testing requests CRUD operations', () => {
  let requestId;
  it('should create a request', async () => {
    const response = await request(app)
      .post('/requests/create')
      .send({
        link: 'http://restlessdevtools.com/irra',
        method: 'POST',
        name: 'We want to yell IRRA',
        format: 'JSON',
      });
    requestId = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should fail on create a request', async () => {
    const response = await request(app)
      .post('/requests/create')
      .send({
        name: 'test',
        description: 'test',
      });
    expect(response.status).toBe(400);
  });

  it('should return a single request', async () => {
    const name = 'We want to yell IRRA';
    const response = await request(app)
      .get(`/requests/show/${requestId}`)
      .send();

    expect(response.body.name).toBe(name);
  });

  it('should return all requests', async () => {
    const response = await request(app)
      .get('/requests/all')
      .send();

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a request', async () => {
    const response = await request(app)
      .put(`/requests/update/${requestId}`)
      .send({
        name: 'Just a simple request',
      });

    expect(response.status).toBe(200);
  });

  it('should delete a request', async () => {
    const response = await request(app)
      .delete(`/requests/delete/${requestId}`)
      .send();

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  models.sequelize.close();
});
