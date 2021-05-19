import models from '../models';

export default class RequestBodyRepository {
  constructor() {
    this.db = models.RequestBody;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(requestBody) {
    const createdRequest = await this.db.create({
      body: requestBody.body,
      requestId: requestBody.requestId,
    });
    return createdRequest;
  }

  async edit(paramsId, requestBody) {
    await this.db.update({
      body: requestBody.body,
      requestId: requestBody.requestId,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getRequestBody(paramsId);
  }

  getRequestBody(paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
      },
    });
  }

  getByRequestId(requestId) {
    return this.db.findOne({
      where: {
        requestId,
      },
    });
  }

  deleteByRequestId(requestId) {
    return this.db.destroy({
      where: {
        requestId,
      },
    });
  }
}
