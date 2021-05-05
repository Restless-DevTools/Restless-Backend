import models from '../models';

export default class ResponseRepository {
  constructor() {
    this.db = models.Response;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(response) {
    const createdresponse = await this.db.create({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      requestId: response.requestId,
      contentType: response.contentType,
      size: response.size, // bytes
    });
    return createdresponse;
  }

  async edit(paramsId, response) {
    await this.db.update({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      requestId: response.requestId,
      contentType: response.contentType,
      size: response.size, // bytes
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getResponse(paramsId);
  }

  getResponse(paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
      },
    });
  }

  getResponseByRequestId(requestId) {
    return this.db.findAll({
      where: {
        requestId,
      },
    });
  }

  delete(paramsId) {
    return this.db.destroy({
      where: {
        id: paramsId,
      },
    });
  }
}
